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
    Finds celestial objects on Earth using Google Places API, filtering for natural/relevant locations.
    """
    print(f"--- Tool: find_earth_analogues called with query: '{query}' ---")
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")

    if not api_key:
        error_msg = "ERROR: GOOGLE_MAPS_API_KEY is not set in environment variables."
        print(f"--- Tool: find_earth_analogues failed: {error_msg} ---")
        return error_msg

    try:
        gmaps = googlemaps.Client(key=api_key)
        places_result = gmaps.places(query=query)

        if places_result.get('status') == 'OK' and places_result.get('results'):
            formatted_results = []
            
            excluded_types = {
                'lodging', 'restaurant', 'food', 'store', 'clothing_store', 
                'finance', 'health', 'real_estate_agency', 'route', 
                'gas_station', 'car_dealer', 'supermarket'
            }

            count = 0
            for place in places_result['results']:
                if count >= 3:
                    break

                place_types = set(place.get('types', []))
                
                if not place_types.isdisjoint(excluded_types):
                    continue

                if 'route' in place_types and 'park' not in place_types and 'natural_feature' not in place_types:
                    continue

                result_info = {
                    "name": place.get('name'),
                    "address": place.get('formatted_address'),
                    "rating": place.get('rating', 'N/A'),
                    "types": list(place_types),
                    "latitude": place['geometry']['location']['lat'],
                    "longitude": place['geometry']['location']['lng']
                }
                formatted_results.append(result_info)
                count += 1

            if not formatted_results and places_result['results']:
                 place = places_result['results'][0]
                 formatted_results.append({
                    "name": place.get('name'),
                    "address": place.get('formatted_address'),
                    "latitude": place['geometry']['location']['lat'],
                    "longitude": place['geometry']['location']['lng']
                 })

            result_str = json.dumps(formatted_results, indent=2)
            print(f"--- Tool: find_earth_analogues returned {len(formatted_results)} curated places. ---")
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
            "Sun", "Mercury", "Venus", "Earth", "Moon", "Mars",
            "Jupiter", "Saturn", "Uranus", "Neptune"
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