import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import logging
import google.generativeai as genai

load_dotenv()

logging.basicConfig(level=logging.INFO)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logging.error("GEMINI_API_KEY is not set in environment variables.")
else:
    logging.info("Gemini API key loaded.")

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
    message: str

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
    logging.info(f"Received message: {input.message}")
    try:
        response = model.generate_content(input.message)
        logging.info(f"Gemini response: {response.text}")
        return {"reply": response.text}
    except Exception as e:
        logging.exception("Error during Gemini content generation")
        return {"error": str(e)}