# backend/main.py
import os
from fastapi import FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import logging
import httpx
from fastapi.responses import StreamingResponse
import io

from .agent import root_agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.agents.run_config import RunConfig, StreamingMode
from google.genai.types import Content, Part
from .state import TEST_USER_ID

from elevenlabs.client import ElevenLabs

load_dotenv()
logging.basicConfig(level=logging.INFO)

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not ELEVENLABS_API_KEY:
    logging.warning("ELEVENLABS_API_KEY not found in .env file. Speech synthesis will be disabled.")
    eleven_client = None
else:
    eleven_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
    logging.info("ElevenLabs client initialized.")

TAVUS_API_KEY = os.getenv("TAVUS_API_KEY")
TAVUS_REPLICA_ID = os.getenv("TAVUS_REPLICA_ID")
TAVUS_PERSONA_ID = os.getenv("TAVUS_PERSONA_ID")
if not TAVUS_API_KEY:
    logging.warning("Tavus API Key not found. Video avatar will be disabled.")

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

# Model for incoming chat requests
class ChatRequest(BaseModel):
    query: str

# Model for voiceover request
class SpeechRequest(BaseModel):
    text: str

@app.get("/")
async def read_root():
    return {"Welcome to": "Celestine"}

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

@app.post("/synthesize-speech")
async def synthesize_speech(request: SpeechRequest):
    if not eleven_client:
        raise HTTPException(status_code=500, detail="ElevenLabs API is not configured on the server.")

    try:

        audio_stream = eleven_client.text_to_speech.stream(
            text=request.text,
            voice_id="Aa6nEBJJMKJwJkCx8VU2",
            model_id='eleven_multilingual_v2'
        )

        audio_bytes_io = io.BytesIO()
        for chunk in audio_stream:
            audio_bytes_io.write(chunk)
        audio_bytes_io.seek(0)

        return StreamingResponse(audio_bytes_io, media_type="audio/mpeg")

    except Exception as e:
        logging.exception(f"Error during ElevenLabs speech synthesis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/tavus-replica-thumbnail")
async def get_tavus_replica_thumbnail():
    if not TAVUS_API_KEY or not TAVUS_REPLICA_ID:
        raise HTTPException(status_code=500, detail="Tavus is not configured on the server.")

    url = f"https://tavusapi.com/v2/replicas/{TAVUS_REPLICA_ID}"
    headers = {"x-api-key": TAVUS_API_KEY}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            return {"thumbnail_url": data.get("thumbnail_video_url")}
        except httpx.HTTPStatusError as e:
            logging.error(f"Tavus API returned an error: {e.response.text}")
            raise HTTPException(status_code=e.response.status_code, detail="Error from Tavus API.")
        except Exception as e:
            logging.error(f"Failed to fetch Tavus replica thumbnail: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch replica thumbnail.")


@app.post("/create-tavus-conversation")
async def create_tavus_conversation():
    if not all([TAVUS_API_KEY, TAVUS_REPLICA_ID, TAVUS_PERSONA_ID]):
        raise HTTPException(status_code=500, detail="Tavus is not configured on the server.")

    url = "https://tavusapi.com/v2/conversations"
    headers = {"x-api-key": TAVUS_API_KEY, "Content-Type": "application/json"}
    payload = {
        "replica_id": TAVUS_REPLICA_ID,
        "persona_id": TAVUS_PERSONA_ID,
        "conversation_name": "Celestine Space Agent Session",
        "custom_greeting": "Greetings, Explorer! I am ready to assist you. What is on your mind?",
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return {
                "conversation_url": data.get("conversation_url"),
                "conversation_id": data.get("conversation_id")
            }
        except httpx.HTTPStatusError as e:
            logging.error(f"Tavus API returned an error creating conversation: {e.response.text}")
            raise HTTPException(status_code=e.response.status_code, detail="Error from Tavus API.")
        except Exception as e:
            logging.error(f"Failed to create Tavus conversation: {e}")
            raise HTTPException(status_code=500, detail="Failed to create conversation.")

@app.delete("/end-tavus-conversation/{conversation_id}")
async def end_tavus_conversation(conversation_id: str = Path(..., title="The ID of the conversation to end")):
    if not TAVUS_API_KEY:
        raise HTTPException(status_code=500, detail="Tavus is not configured on the server.")

    url = f"https://tavusapi.com/v2/conversations/{conversation_id}"
    headers = {"x-api-key": TAVUS_API_KEY}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.delete(url, headers=headers)
            response.raise_for_status()
            logging.info(f"Successfully ended Tavus conversation: {conversation_id}")
            return {"status": "success", "message": "Conversation ended."}
        except httpx.HTTPStatusError as e:
            logging.error(f"Tavus API returned an error ending conversation: {e.response.text}")
            raise HTTPException(status_code=e.response.status_code, detail="Error from Tavus API.")
        except Exception as e:
            logging.error(f"Failed to end Tavus conversation: {e}")
            raise HTTPException(status_code=500, detail="Failed to end conversation.")