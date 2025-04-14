import random
from copy import deepcopy
from fetch_data import fetch_all_sessions
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import argparse
from collections import defaultdict
from datetime import datetime, timezone

# === Load environment variables ===
load_dotenv()

# === Connect to MongoDB Atlas ===
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["smartsched"]
generated_schedules = db["generated_schedules"]
generated_schedules_all = db["generated_schedules_all"]
users_collection = db["users"]

# === Argument parser for multiple emails ===
parser = argparse.ArgumentParser()
parser.add_argument("--emails", help="Comma-separated user emails")
parser.add_argument("--role", help="User role (optional)")
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
DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

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
                penalty += 10
            instructors.add(s["instructor_id"])

            if s["group_id"] in groups:
                penalty += 10
            groups.add(s["group_id"])

            if s["location"] in rooms:
                penalty += 10
            rooms.add(s["location"])

    return penalty

# === Conflict-Free Slot Assignment ===
def assign_conflict_free_slots(sessions):
    student_occupied = defaultdict(set)
    instructor_occupied = defaultdict(set)

    for session in sessions:
        conflict = True
        attempts = 0

        while conflict and attempts < 200:
            day = random.choice(DAYS)
            start_idx = random.randint(0, len(HOURS) - 2)
            start_time = HOURS[start_idx]
            end_time = HOURS[start_idx + 1]
            time_slot = (day, start_time, end_time)

            if (time_slot not in student_occupied[session["group_id"]] and
                    time_slot not in instructor_occupied[session["instructor_id"]]):

                session["day"] = day
                session["start_time"] = start_time
                session["end_time"] = end_time

                student_occupied[session["group_id"]].add(time_slot)
                instructor_occupied[session["instructor_id"]].add(time_slot)
                conflict = False

            attempts += 1

    return sessions

# === Generate Initial Population ===
def generate_population(base_sessions):
    population = []
    unique_sessions_set = set()
    unique_sessions = []

    for session in base_sessions:
        key = (
            session["module_id"],
            session["group_id"],
            session["instructor_id"]
        )
        if key not in unique_sessions_set:
            unique_sessions_set.add(key)
            unique_sessions.append(deepcopy(session))

    for _ in range(POPULATION_SIZE):
        individual = deepcopy(unique_sessions)
        individual = assign_conflict_free_slots(individual)
        random.shuffle(individual)
        population.append(individual)

    return population

# === Parent Selection ===
def select_parents(population):
    return sorted(population, key=calculate_fitness)[:2]

# === Crossover ===
def crossover(parent1, parent2):
    mid = len(parent1) // 2
    child = deepcopy(parent1[:mid] + parent2[mid:])
    return assign_conflict_free_slots(child)

# === Mutation ===
def mutate(timetable):
    if len(timetable) < 2:
        return timetable
    if random.random() < MUTATION_RATE:
        i, j = random.sample(range(len(timetable)), 2)
        timetable[i], timetable[j] = timetable[j], timetable[i]
    return assign_conflict_free_slots(timetable)

# === Genetic Algorithm Main Function ===
def run_genetic_algorithm(user_email, user_role):
    print(f"\n🚀 Running scheduler for {user_email} ({user_role})")
    base_sessions = fetch_all_sessions(user_email, user_role)
    if not base_sessions:
        print("❌ No valid sessions found. Skipping.")
        return

    population = generate_population(base_sessions)
    best_fitness = float("inf")
    best_schedule = None
    sorted_population = []

    for gen in range(GENERATIONS):
        new_population = []
        parents = select_parents(population)

        while len(new_population) < POPULATION_SIZE:
            child = crossover(parents[0], parents[1])
            child = mutate(child)
            new_population.append(child)

        population = new_population
        sorted_population = sorted(population, key=calculate_fitness)
        generation_best = sorted_population[0]
        generation_fitness = calculate_fitness(generation_best)

        if generation_fitness < best_fitness:
            best_fitness = generation_fitness
            best_schedule = generation_best

        debug(f"Generation {gen+1} | Best Fitness: {generation_fitness}")

        if best_fitness == 0:
            debug("🎯 Perfect schedule found! Stopping early.")
            break

    batch_id = save_all_schedules(user_email, sorted_population)
    save_best_schedule(user_email, best_schedule, batch_id, base_sessions)

# === Save All Schedules ===
def save_all_schedules(user_email, sorted_population):
    batch_id = f"{user_email}_gen_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}"
    for rank, schedule in enumerate(sorted_population, start=1):
        generated_schedules_all.insert_one({
            "userEmail": user_email,
            "batchId": batch_id,
            "rank": rank,
            "fitnessScore": calculate_fitness(schedule),
            "generatedAt": datetime.now(timezone.utc),
            "timetable": schedule
        })
    return batch_id

# === Save Best Schedule ===
def save_best_schedule(user_email, schedule, batch_id, base_sessions):
    session_map = {
        (s["day"], s["start_time"], s["module_id"]): s.get("event")
        for s in base_sessions
    }

    enriched_schedule = []
    for s in schedule:
        key = (s["day"], s["start_time"], s["module_id"])
        s["event"] = session_map.get(key)
        enriched_schedule.append(s)

    result = {
        "userEmail": user_email,
        "generatedBy": "AI Scheduler",
        "fitnessScore": calculate_fitness(enriched_schedule),
        "batchId": batch_id,
        "generatedAt": datetime.now(timezone.utc),
        "timetable": enriched_schedule
    }
    inserted = generated_schedules.insert_one(result)
    print(f"✅ Best schedule saved for {user_email} | ID: {inserted.inserted_id}")

# === Role Detection from MongoDB ===
def get_user_role(email):
    user = users_collection.find_one({"email": email})
    if not user:
        print(f"⚠️ No user found for {email}. Skipping.")
        return None
    return user.get("role")

# === Main Execution ===
if __name__ == "__main__":
    print("⚙️  Starting Bulk Genetic Scheduling for SmartSched...")

    emails = args.emails.split(",") if args.emails else []
    role_arg = args.role

    if not emails:
        print("❌ No emails provided.")
        exit(1)

    for email in emails:
        role = role_arg if role_arg and role_arg != "user" else get_user_role(email)
        if role not in ["student", "lecturer"]:
            print(f"⚠️ Skipping {email} due to invalid role: {role}")
            continue

        run_genetic_algorithm(email, role)
