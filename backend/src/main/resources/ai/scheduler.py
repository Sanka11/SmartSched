import random
from copy import deepcopy
from fetch_data import fetch_all_sessions
from pymongo import MongoClient
import os
from dotenv import load_dotenv
load_dotenv()
from collections import defaultdict

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["smartsched"]
generated_schedules = db["generated_schedules"]


# === Genetic Algorithm Parameters ===
POPULATION_SIZE = 20
GENERATIONS = 50
MUTATION_RATE = 0.1

# === Fitness Function ===
def calculate_fitness(timetable):
    penalty = 0

    # ── Conflict Checks ──
    schedule_map = defaultdict(list)

    for session in timetable:
        key = (session["day"], session["start_time"], session["end_time"])
        schedule_map[key].append(session)

    for time_key, sessions in schedule_map.items():
        instructors = set()
        groups = set()
        rooms = set()

        for s in sessions:
            if s["instructor_id"] in instructors:
                penalty += 5  # Instructor clash
            else:
                instructors.add(s["instructor_id"])

            if s["group_id"] in groups:
                penalty += 5  # Group clash
            else:
                groups.add(s["group_id"])

            if s["location"] in rooms:
                penalty += 5  # Room clash
            else:
                rooms.add(s["location"])

    # ── Weekly Balance Checks ──
    group_day_count = defaultdict(lambda: defaultdict(int))
    instructor_day_count = defaultdict(lambda: defaultdict(int))

    for s in timetable:
        group_day_count[s["group_id"]][s["day"]] += 1
        instructor_day_count[s["instructor_id"]][s["day"]] += 1

    # Rule 1: Too many sessions in one day (>4) → +3 penalty per extra session
    for group, days in group_day_count.items():
        for day, count in days.items():
            if count > 4:
                penalty += (count - 4) * 3

    for instructor, days in instructor_day_count.items():
        for day, count in days.items():
            if count > 4:
                penalty += (count - 4) * 3

    # Rule 2: Too few active days (<3) → +5 penalty
    for group, days in group_day_count.items():
        if len(days) < 3:
            penalty += 5

    for instructor, days in instructor_day_count.items():
        if len(days) < 3:
            penalty += 5

    return penalty


# === Generate Initial Population ===
def generate_population(base_sessions):
    population = []
    
    # Remove duplicates: keep only one (module + group) per timetable
    unique_sessions_map = {}
    for session in base_sessions:
        key = (session["module_id"], session["group_id"])
        if key not in unique_sessions_map:
            unique_sessions_map[key] = session

    unique_sessions = list(unique_sessions_map.values())

    for _ in range(POPULATION_SIZE):
        individual = deepcopy(unique_sessions)
        random.shuffle(individual)
        population.append(individual)

    return population


# === Parent Selection ===
def select_parents(population):
    sorted_pop = sorted(population, key=calculate_fitness)
    return sorted_pop[:2]

# === Crossover ===
def crossover(parent1, parent2):
    mid = len(parent1) // 2
    child = parent1[:mid] + parent2[mid:]
    return child

# === Mutation ===
def mutate(timetable):
    if random.random() < MUTATION_RATE:
        i, j = random.sample(range(len(timetable)), 2)
        timetable[i], timetable[j] = timetable[j], timetable[i]
    return timetable

# === Main Genetic Algorithm ===
def run_genetic_algorithm():
    base_sessions = fetch_all_sessions()
    population = generate_population(base_sessions)

    best_fitness = float("inf")
    best_schedule = None

    for gen in range(GENERATIONS):
        new_population = []
        parents = select_parents(population)

        while len(new_population) < POPULATION_SIZE:
            child = crossover(parents[0], parents[1])
            child = mutate(child)
            new_population.append(child)

        population = new_population
        generation_best = min(population, key=calculate_fitness)
        generation_fitness = calculate_fitness(generation_best)

        if generation_fitness < best_fitness:
            best_fitness = generation_fitness
            best_schedule = generation_best

        print(f"Generation {gen+1} | Best Fitness: {generation_fitness}")

        if best_fitness == 0:
            print("🎯 Perfect schedule found! Stopping early.")
            break

    return best_schedule

# === Run and Display Best Schedule ===
if __name__ == "__main__":
    print("⚙️  Running Genetic Algorithm for SmartSched...")
    best_timetable = run_genetic_algorithm()

    print("\n✅ Best Timetable Generated:")
    for i, session in enumerate(best_timetable, start=1):
        print(f"{i}. {session['module_name']} ({session['group_name']}) | "
              f"{session['day']} {session['start_time']}–{session['end_time']} | "
              f"{session['location']} | Instructor: {session['instructor_name']}")

# === Save to MongoDB ===
def save_to_generated_schedules(schedule):
    result = {
        "generatedBy": "AI Scheduler",
        "fitnessScore": calculate_fitness(schedule),
        "timetable": schedule
    }
    inserted = generated_schedules.insert_one(result)
    print(f"\n🗂️  Best schedule saved to 'generated_schedules' with ID: {inserted.inserted_id}")

# === Save the best one
save_to_generated_schedules(best_timetable)
