# backend/test_search.py
from backend.tools import find_earth_analogues
from dotenv import load_dotenv
import os

load_dotenv()

if not os.getenv("GOOGLE_MAPS_API_KEY"):
    print("❌ ERROR: Key not found! Check .env file.")
    exit()

query = "Grand Canyon"
print(f"\n🔍 Test: '{query}'...")
result = find_earth_analogues(query)
print("\n📋 RESULT:")
print(result)