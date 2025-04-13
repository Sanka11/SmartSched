import random
from copy import deepcopy
from fetch_data import fetch_all_sessions
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import argparse
from collections import defaultdict

# === Load environment variables ===
load_dotenv()

# === Connect to MongoDB Atlas ===
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["smartsched"]
generated_schedules = db["generated_schedules"]

# === Argument parser for user email and role ===
parser = argparse.ArgumentParser()
parser.add_argument("--email", help="User email")
parser.add_argument("--role", help="User role")
args = parser.parse_args()

# === Debug toggle ===
DEBUG = True
def debug(msg):
    if DEBUG:
        print(msg)

# === Genetic Algorithm Parameters ===
POPULATION_SIZE = 20
GENERATIONS = 50
MUTATION_RATE = 0.1

# === Fitness Function ===
def calculate_fitness(timetable):
    penalty = 0
    schedule_map = defaultdict(list)

    for session in timetable:
        key = (session["day"], session["start_time"], session["end_time"])
        schedule_map[key].append(session)

    for sessions in schedule_map.values():
        instructors, groups, rooms = set(), set(), set()
        for s in sessions:
            if s["instructor_id"] in instructors:
                penalty += 5
            instructors.add(s["instructor_id"])

            if s["group_id"] in groups:
                penalty += 5
            groups.add(s["group_id"])

            if s["location"] in rooms:
                penalty += 5
            rooms.add(s["location"])

    group_day_count = defaultdict(lambda: defaultdict(int))
    instructor_day_count = defaultdict(lambda: defaultdict(int))

    for s in timetable:
        group_day_count[s["group_id"]][s["day"]] += 1
        instructor_day_count[s["instructor_id"]][s["day"]] += 1

    for group, days in group_day_count.items():
        for day, count in days.items():
            if count > 4:
                penalty += (count - 4) * 3
        if len(days) < 3:
            penalty += 5

    for instructor, days in instructor_day_count.items():
        for day, count in days.items():
            if count > 4:
                penalty += (count - 4) * 3
        if len(days) < 3:
            penalty += 5

    return penalty

# === Generate Initial Population ===
def generate_population(base_sessions):
    population = []
    
    # ✅ Improved duplicate prevention
    unique_sessions_set = set()
    unique_sessions = []
    
    for session in base_sessions:
        # Create a composite key for uniqueness
        key = (
            session["module_id"],
            session["group_id"],
            session["instructor_id"],
            session["day"],
            session["start_time"],
            session["end_time"]
        )
        if key not in unique_sessions_set:
            unique_sessions_set.add(key)
            unique_sessions.append(session)

    for _ in range(POPULATION_SIZE):
        individual = deepcopy(unique_sessions)
        random.shuffle(individual)
        population.append(individual)

    return population


# === Parent Selection ===
def select_parents(population):
    return sorted(population, key=calculate_fitness)[:2]

# === Crossover ===
def crossover(parent1, parent2):
    mid = len(parent1) // 2
    return parent1[:mid] + parent2[mid:]

# === Mutation ===
def mutate(timetable):
    if len(timetable) < 2:
        return timetable  

    if random.random() < MUTATION_RATE:
        i, j = random.sample(range(len(timetable)), 2)
        timetable[i], timetable[j] = timetable[j], timetable[i]

    return timetable


# === Genetic Algorithm Main Function ===
def run_genetic_algorithm(user_email=None, user_role=None):
    if user_role not in ["student", "lecturer", "user"]:
        print(f"⚠️ Invalid role: {user_role}. Must be one of: student, lecturer, user.")
        return None

    base_sessions = fetch_all_sessions(user_email, user_role)
    if not base_sessions:
        print("❌ No valid sessions found for user. Aborting schedule generation.")
        return None

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

        debug(f"Generation {gen+1} | Best Fitness: {generation_fitness}")

        if best_fitness == 0:
            debug("🎯 Perfect schedule found! Stopping early.")
            break

    return best_schedule

# === Save to MongoDB ===
def save_to_generated_schedules(schedule):
    result = {
        "generatedBy": args.email if args.email else "AI Scheduler",
        "fitnessScore": calculate_fitness(schedule),
        "timetable": schedule
    }
    inserted = generated_schedules.insert_one(result)
    print(f"\n🗂️  Best schedule saved to 'generated_schedules' with ID: {inserted.inserted_id}")

# === Main Script Execution ===
if __name__ == "__main__":
    print("⚙️  Running Genetic Algorithm for SmartSched...")
    best_timetable = run_genetic_algorithm(args.email, args.role)

    if not best_timetable:
        print("❌ Timetable generation failed or returned empty result.")
    else:
        print("\n✅ Best Timetable Generated:")
        for i, session in enumerate(best_timetable, start=1):
            print(f"{i}. {session['module_name']} ({session['group_name']}) | "
                  f"{session['day']} {session['start_time']}–{session['end_time']} | "
                  f"{session['location']} | Instructor: {session['instructor_name']}")
        save_to_generated_schedules(best_timetable)
