# backend/main.py
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import logging
import google.generativeai as genai
import googlemaps

from .agent import root_agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.agents.run_config import RunConfig, StreamingMode
from google.genai.types import Content, Part
from .state import TEST_USER_ID

load_dotenv()
logging.basicConfig(level=logging.INFO)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    logging.error("GOOGLE_API_KEY is not set in environment variables.")
else:
    logging.info("Google API key loaded.")

GOOGLE_MAPS_PLACES_API_KEY = os.getenv("GOOGLE_MAPS_PLACES_API_KEY")
if not GOOGLE_MAPS_PLACES_API_KEY:
    logging.error("GOOGLE_MAPS_PLACES_API_KEY is not set in environment variables.")
    gmaps = None
else:
    logging.info("Google Maps Places API key loaded.")
    gmaps = googlemaps.Client(key=GOOGLE_MAPS_PLACES_API_KEY)

genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

APP_NAME = "celestine"
SESSION_ID = "default_session"
session_service = InMemorySessionService()

class ChatInput(BaseModel):
    query: str

class PlaceSearchInput(BaseModel):
    query: str

class ChatRequest(BaseModel):
    query: str

try:
    model = genai.GenerativeModel("gemini-2.5-flash")
    logging.info("Gemini model initialized successfully.")
except Exception as e:
    logging.exception("Error initializing Gemini model.")

@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    """
    Accepts the request, initializes the Runner
    and executes the agent system logic.
    """
    logging.info(f"Received request with query: '{request.query}'")
    try:
        runner = Runner(
            agent=root_agent,
            app_name=APP_NAME,
            session_service=session_service
        )
        logging.info("Runner created for this request.")

        # Check if the session exists and create it if not.
        try:
            await session_service.get_session(APP_NAME, TEST_USER_ID, SESSION_ID)
        except Exception:
            logging.info("Session not found, creating a new one...")
            await session_service.create_session(
                app_name=APP_NAME, user_id=TEST_USER_ID, session_id=SESSION_ID
            )
            logging.info("New session created.")

        # Setup and running the agent
        run_config = RunConfig(streaming_mode=StreamingMode.NONE, max_llm_calls=100)
        content = Content(role="user", parts=[Part(text=request.query)])

        logging.info("Calling runner.run_async...")
        async for event in runner.run_async(
                user_id=TEST_USER_ID,
                session_id=SESSION_ID,
                new_message=content,
                run_config=run_config
        ):
            if event.is_final_response():
                logging.info("Final response received from agent.")
                if event.content and event.content.parts:
                    return {"response": event.content.parts[0].text}
                else:
                    logging.error("Final response event has no content or parts.")
                    raise HTTPException(status_code=500, detail="Agent returned an empty final response.")

        logging.warning("Agent finished run without a final response event.")
        raise HTTPException(status_code=500, detail="No final response from agent.")

    except Exception as e:
        logging.exception(f"An unhandled error occurred in the agent logic: {e}")
        raise HTTPException(status_code=500, detail="Agent failed to process your query.")

@app.post("/search_places")
async def search_places(input: PlaceSearchInput):
    logging.info(f"Received place search query: {input.query}")
    if not gmaps:
        logging.error("Google Maps client not initialized. Places API key might be missing.")
        raise HTTPException(status_code=500, detail="Google Maps Places API is not configured.")

    try:
        logging.info(f"Calling Google Places API with query: '{input.query}'")
        response = gmaps.places(query=input.query)

        logging.debug(f"Full Google Places API response: {response}")

        results = []
        for place in response.get('results', []):
            place_data = {
                "place_id": place.get('place_id'),
                "name": place.get('name'),
                "address": place.get('formatted_address'),
                "latitude": place['geometry']['location']['lat'],
                "longitude": place['geometry']['location']['lng'],
                "rating": place.get('rating'),
                "user_ratings_total": place.get('user_ratings_total'),
                "types": place.get('types'),
                "photos": [
                    f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={p['photo_reference']}&key={GOOGLE_MAPS_PLACES_API_KEY}"
                    for p in place.get('photos', [])
                ]
            }
            results.append(place_data)
            logging.info(f"Found place: {place_data.get('name')} (ID: {place_data.get('place_id')})")

        logging.info(f"Found {len(results)} places for query: {input.query}")
        return {"places": results}

    except Exception as e:
        logging.exception(f"Error during Google Places API search for query: {input.query}")
        raise HTTPException(status_code=500, detail=f"Error searching places: {str(e)}")