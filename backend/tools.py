# backend/tools.py
import os
import googlemaps
import json
from dotenv import load_dotenv
from typing import Optional, Literal

load_dotenv()

def say_hello(name: Optional[str] = None) -> str:
    if name:
        greeting = f"Hello, {name}!"
        print(f"--- Tool: say_hello called with name: {name} ---")
    else:
        greeting = "Hello there!"
        print(f"--- Tool: say_hello called without a specific name (name_arg_value: {name}) ---")
    return greeting

def say_goodbye() -> str:
    print(f"--- Tool: say_goodbye called ---")
    return "Goodbye! Have a great day."

def find_earth_analogues(query: str) -> str:
    """
    Finds celestial objects on Earth using Google Places API.

    Args:
        query: Search query (eg "shield volcano hawaii" или "large impact crater").

    Returns:
        JSON string containing a list of found locations or an error message.
    """
    print(f"--- Tool: find_earth_analogues called with query: '{query}' ---")
    api_key = os.getenv("GOOGLE_MAPS_PLACES_API_KEY")

    if not api_key:
        error_msg = "ERROR: GOOGLE_MAPS_PLACES_API_KEY is not set in environment variables."
        print(f"--- Tool: find_earth_analogues failed: {error_msg} ---")
        return error_msg

    try:
        gmaps = googlemaps.Client(key=api_key)
        places_result = gmaps.places(query=query)

        if places_result.get('status') == 'OK' and places_result.get('results'):
            formatted_results = []
            for place in places_result['results'][:3]:
                result_info = {
                    "name": place.get('name'),
                    "address": place.get('formatted_address'),
                    "rating": place.get('rating', 'N/A'),
                    "latitude": place['geometry']['location']['lat'],
                    "longitude": place['geometry']['location']['lng']
                }
                formatted_results.append(result_info)

            result_str = json.dumps(formatted_results, indent=2)
            print(f"--- Tool: find_earth_analogues found {len(formatted_results)} places. ---")
            return result_str
        else:
            message = f"No Earth analogues found for the query: '{query}'"
            print(f"--- Tool: find_earth_analogues: {message} ---")
            return message

    except Exception as e:
        error_msg = f"An error occurred while calling Google Places API: {e}"
        print(f"--- Tool: find_earth_analogues failed: {error_msg} ---")
        return error_msg

def navigate_to_planet(
        planet_name: Literal[
            "Sun", "Mercury", "Venus", "Earth", "Mars"
            # Add other planets here as needed
        ]
) -> str:
    """
    Instructs the frontend to navigate to a specific planet's surface view.
    It returns a JSON object that the frontend can understand.
    """
    print(f"--- Tool: navigate_to_planet called for: '{planet_name}' ---")

    response_data = {
        "action": "navigate",
        "target": planet_name,
        "summary": f"Initiating landing sequence for {planet_name}. Stand by."
    }
    return json.dumps(response_data)

print("All tools defined.")