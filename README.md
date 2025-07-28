# Celestine

![React](https://img.shields.io/badge/frontend-React-61DAFB?logo=react&logoColor=white)
![Python](https://img.shields.io/badge/backend-Python-3776AB?logo=python&logoColor=white)
![Google Maps](https://img.shields.io/badge/API-Google%20Maps%20Platform-4285F4?logo=googlemaps&logoColor=white)
![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-673AB7?logo=google&logoColor=white)
![ADK](https://img.shields.io/badge/Agent%20Development%20Kit-ADK-34A853?logo=googlecloud&logoColor=white)

Intelligent navigator of the Universe. The name of the project Celestine symbolizes an intelligent agent (AI), which, like a celestial guide, helps navigate the unknown data of the space landscape 🧑‍🚀.

The project is being developed to participate in the [Google Maps Platform Awards](https://devpost.com/software/celestine-rg16km) hackathon.

## Features

- Space map
  - Landing on the planet
  - Display points of interest
  - Search for analogues on Earth
- 2D/3D map of the Earth
- Chat with agent system
  - Greeting & Farewell Agents
  - Cosmos Specialist Agent
  - Analogues Specialist Agent:
    - display results on 2D map of the Earth
- Voice acting of agent responses in chat

> Note: Voice library may require a few extra seconds to process longer agent responses.

## Technologies

- React + Vite
- Python + FastAPI
- Google Maps Platform API
- Gemini 2.5 Flash
- Agent Development Kit (ADK)
- ElevenLabs API (voice: Quentin)

Tools: PyCharm 2025.1.3.1

### Using the Google Maps

- Google Maps JavaScript API - view 3D map of Earth
- [Places API Web Service](https://developers.google.com/maps/documentation/places/web-service)

### Planet Surface Textures

All planetary surface textures are courtesy of NASA and available through their public science image galleries.

> Note on Terminology: For code simplification, the term "planet" is used broadly to refer to all celestial bodies.
This is for implementation convenience, acknowledging the Sun is a star.

This project utilizes:

- [NASA Science Image Gallery](https://science.nasa.gov/gallery)
  - [Sun](https://science.nasa.gov/image-detail/amf-gsfc_20171208_archive_e001435/)
  - [Mercury](https://science.nasa.gov/image-detail/pia19422-mercury/)
  - [Venus](https://science.nasa.gov/image-detail/amf-ba0639bb-149b-4e6a-91c7-be0b928c7897/)
  - [Mars](https://science.nasa.gov/image-detail/amf-pia02653/)

## Architecture

Simple agent example by [Create Agent Project](https://google.github.io/adk-docs/get-started/quickstart/#create-agent-project) tutorial: `backend/multi_tool_agent`.

## Installation

### Frontend setup

1. Navigate to the `frontend` folder:
    ```bash  
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the Node.js server:
    ```bash
    npm run dev
    ```

### Backend setup

1. Navigate to the `backend` folder:
    ```bash  
    cd backend
    ```

2. Create a virtual environment:
    ```bash  
    python -m venv .venv 
    ```

3. Activate the virtual environment:
- PowerShell:
```bash  
  .venv\Scripts\Activate.ps1  
 ``` 
- Bash/Mac:
```bash  
  source .venv/bin/activate
  ```

4. Install dependencies:
```bash  
  pip install -r requirements.txt
 ``` 

5. Run the FastAPI server:
```bash  
  uvicorn main:app --reload --port 8080
 ``` 

> To run Google Agent, enter the `adk web` command.

## Testing

Coordinator analyzes the intent and passes the task to the specialized agent.

### Greeting & Farewell Agent

> Hi, my name is Leo.

> Bye, see you soon.

### Cosmos Specialist Agent

> How are black holes formed?

### Analogues Specialist Agent

In the ADK Web UI:

> I want to find an Earth analogue of Maat Mons on Venus.

> I'm looking for something on the Moon that's similar to a Van de Graaff generator on Earth.

On the app UI:

Move to "Flight into Space", and click:

- Polar Ice Caps on Mars (many analog POIs)
- Discovery Rupes on Mercury (one analog POI)
- Sunspots on Sun (no analog POI)

## LICENSE

Licensed under the MIT License. See the LICENSE file for details.