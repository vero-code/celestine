# backend/agents.py
from google.adk.agents import Agent
from .tools import (
    say_hello,
    say_goodbye
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

# List of Sub-Agents
SUB_AGENTS = [
    greeting_agent,
    farewell_agent,
]

# If some agent is not created
SUB_AGENTS = [agent for agent in SUB_AGENTS if agent is not None]