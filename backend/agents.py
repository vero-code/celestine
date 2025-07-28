# backend/agents.py
from google.adk.agents import Agent
from .tools import (
    say_hello,
    say_goodbye,
    find_earth_analogues,
    navigate_to_planet
)
from .config import (
    MODEL_GEMINI_FLASH,
    MODEL_GEMINI_PRO
)

# --- Greeting Agent ---
greeting_agent = None
try:
    greeting_agent = Agent(
        model = MODEL_GEMINI_FLASH,
        name="GreetingAgent",
        instruction="You are the mission's Communications Officer. Your ONLY task is to welcome the user aboard. "
                    "Use the 'say_hello' tool to generate a warm, space-themed greeting, as if you are welcoming a new explorer to the mission. "
                    "If the user provides their name, pass it to the tool to personalize the welcome. Do not perform any other duties.",
        description="Greets the user with a space-themed welcome, acting as the mission's Communications Officer. Uses the 'say_hello' tool.",
        tools=[say_hello],
    )
    print(f"✅ Agent '{greeting_agent.name}' created using model '{greeting_agent.model}'.")
except Exception as e:
    print(f"❌ Could not create Greeting agent. Check API Key ({greeting_agent.model}). Error: {e}")

# --- Farewell Agent ---
farewell_agent = None
try:
    farewell_agent = Agent(
        model = MODEL_GEMINI_FLASH,
        name="FarewellAgent",
        instruction="You are the mission's Communications Officer. Your ONLY task is to sign off when the user is ending the session. "
                    "Use the 'say_goodbye' tool to generate a polite, space-themed farewell, such as 'safe travels' or 'closing communication channel'. "
                    "Trigger this only when the user clearly indicates they are leaving. Do not engage in any other tasks.",
        description="Signs off with a space-themed farewell message when the user ends the conversation. Uses the 'say_goodbye' tool.",
        tools=[say_goodbye],
    )
    print(f"✅ Agent '{farewell_agent.name}' created using model '{farewell_agent.model}'.")
except Exception as e:
    print(f"❌ Could not create Farewell agent. Check API Key ({farewell_agent.model}). Error: {e}")

# --- Cosmos Specialist Agent ---
cosmos_specialist_agent = None
try:
    cosmos_specialist_agent = Agent(
        model=MODEL_GEMINI_PRO,
        name="CosmosSpecialistAgent",
        instruction="You are the mission's Science Officer. Your expertise is in astronomy and planetary science. "
                    "Your task is to answer the user's general questions about space, planets, stars, and celestial phenomena. "
                    "Provide accurate, clear, and engaging answers suitable for a space enthusiast. "
                    "Do not handle greetings, farewells, or requests for Earth analogues.",
        description="Answers general user questions about space, acting as the mission's Science Officer.",
        tools=[],
    )
    print(f"✅ Agent '{cosmos_specialist_agent.name}' created using model '{cosmos_specialist_agent.model}'.")
except Exception as e:
    print(f"❌ Could not create Cosmos Specialist agent. Check API Key. Error: {e}")

# --- Analogues Specialist Agent ---
analogues_specialist_agent = None
try:
    analogues_specialist_agent = Agent(
        model=MODEL_GEMINI_PRO,
        name="AnaloguesSpecialistAgent",
        instruction="You are a data processing agent. Your ONLY task is to find Earth analogues for a celestial feature and return a structured JSON. "
                    "1. Use the 'find_earth_analogues' tool to get a list of places. "
                    "2. Create a brief, natural-language summary of the findings. "
                    "3. Your final output MUST be a single, valid JSON object. Do not output any other text. "
                    "The JSON object must have two keys: 'summary' (a string with your text summary) and 'places' (the original JSON array of places returned by the tool). "
                    "Example format: {\"summary\": \"text goes here\", \"places\": [{\"name\": \"...\", ...}]}",
        description="Finds Earth-based analogues and returns a structured JSON response with a summary and coordinates.",
        tools=[find_earth_analogues],
    )
    print(f"✅ Agent '{analogues_specialist_agent.name}' created using model '{analogues_specialist_agent.model}'.")
except Exception as e:
    print(f"❌ Could not create Analogues Specialist agent. Check API Key. Error: {e}")

# --- Navigation Agent ---
navigation_agent = None
try:
    navigation_agent = Agent(
        model=MODEL_GEMINI_FLASH,
        name="NavigationAgent",
        instruction="You are the ship's Helmsman. Your function is to parse user text for a planet name "
                    "ignoring case (e.g., 'mars' and 'Mars' are the same),"
                    "and call the 'navigate_to_planet' tool. "
                    "After the tool runs and provides a JSON output, your final response must be "
                    "a brief confirmation message that INCLUDES the raw JSON string from the tool. "
                    "Example: 'Navigating now. {\"action\": \"navigate\", \"target\": \"Mars\", ...}'",
        description="Handles user navigation commands and confirms the action.",
        tools=[navigate_to_planet],
    )
    print(f"✅ Agent '{navigation_agent.name}' created using model '{navigation_agent.model}'.")
except Exception as e:
    print(f"❌ Could not create Navigation agent. Error: {e}")

# List of Sub-Agents
SUB_AGENTS = [
    greeting_agent,
    farewell_agent,
    cosmos_specialist_agent,
    analogues_specialist_agent,
    navigation_agent,
]

# If some agent is not created
SUB_AGENTS = [agent for agent in SUB_AGENTS if agent is not None]