# backend/main.py
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import logging

from .agent import root_agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.agents.run_config import RunConfig, StreamingMode
from google.genai.types import Content, Part
from .state import TEST_USER_ID

load_dotenv()
logging.basicConfig(level=logging.INFO)

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
