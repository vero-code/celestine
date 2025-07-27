# backend/agent.py
from google.adk.agents import Agent
from config import MODEL_GEMINI_PRO
import os
import google.generativeai as genai
from dotenv import load_dotenv

# --- Congiguration ---
load_dotenv()
api_key = os.environ.get("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("API key GOOGLE_API_KEY not found. Please check your .env file.")

genai.configure(api_key=api_key)

# --- Main Coordinator Agent (root_agent) ---
root_agent = Agent(
    name="SpaceAppCoordinator",
    model=MODEL_GEMINI_PRO,
    instruction="You are the central coordinator for an interactive space exploration application. Your main task is to understand a user's request—whether it's a text query or an action related to a celestial object—and delegate it to the most suitable specialized agent on your team. "
                "If the user offers a simple greeting or farewell, delegate to the 'GreetingAgent'. "
                "For general questions about space, planets, stars, craters, or other astronomical objects, use the 'CosmosSpecialistAgent'. "
                "If the user wants to find earthly analogues for a specific celestial object (this request will often come with context from a Point of Interest), delegate the task to the 'AnaloguesSpecialistAgent'. "
                "Maintain the persona of an enthusiastic and knowledgeable space guide. If a request is unclear or cannot be handled, politely explain the application's capabilities.",
    description="The main coordinator for the space exploration app, routing user requests to specialized agents.",
    tools=[],
    sub_agents=[],
)