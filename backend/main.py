# backend/main.py
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import logging
import google.generativeai as genai
import googlemaps

load_dotenv()

logging.basicConfig(level=logging.INFO)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logging.error("GEMINI_API_KEY is not set in environment variables.")
else:
    logging.info("Gemini API key loaded.")

GOOGLE_MAPS_PLACES_API_KEY = os.getenv("GOOGLE_MAPS_PLACES_API_KEY")
if not GOOGLE_MAPS_PLACES_API_KEY:
    logging.error("GOOGLE_MAPS_PLACES_API_KEY is not set in environment variables.")
    gmaps = None
else:
    logging.info("Google Maps Places API key loaded.")
    gmaps = googlemaps.Client(key=GOOGLE_MAPS_PLACES_API_KEY)

genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatInput(BaseModel):
    query: str

class PlaceSearchInput(BaseModel):
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
async def chat(input: ChatInput):
    logging.info(f"Received query: {input.query}")
    if not model:
        logging.error("Gemini model is not initialized.")
        raise HTTPException(status_code=500, detail="Generative model is not available.")
    try:
        response = model.generate_content(input.query)
        logging.info(f"Gemini response: {response.text}")
        return {"response": response.text}
    except Exception as e:
        logging.exception("Error during Gemini content generation")
        raise HTTPException(status_code=500, detail=str(e))

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