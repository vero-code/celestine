# Celestine

Intelligent navigator of the Universe. The name of the project Celestine symbolizes an intelligent agent (AI), which, like a celestial guide, helps navigate the unknown data of the space landscape 🧑‍🚀.

The project is being developed to participate in the [Google Maps Platform Awards](https://devpost.com/software/celestine-rg16km) hackathon.

## Features

- Space map
  - Landing on the planet
- 3D map of the Earth
- Chat with AI

## Technologies

- React + Vite
- Python + FastAPI
- Google Maps Platform API
- Gemini 2.5 Flash

Tools: PyCharm 2025.1.3.1

### Using the Google Maps

- Google Maps JavaScript API - view 3D map of Earth

### Planet Surface Textures

All planetary surface textures are courtesy of NASA and available through their public science image galleries. This project utilizes:

- [NASA Science Image Gallery](https://science.nasa.gov/gallery)
    - [Mercury](https://science.nasa.gov/image-detail/pia19422-mercury/)

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