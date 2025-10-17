import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv()

openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
openrouter_base_url = os.getenv("OPENROUTER_BASE_URL")
openrouter_modelname = os.getenv("OPENROUTER_MODELNAME")

# Validate credentials
if not openrouter_api_key or openrouter_api_key == "YOUR_OPENROUTER_API_KEY_HERE":
    raise ValueError("OpenRouter API Key not found or not set. Please set it in the .env file.")
if not openrouter_base_url:
    raise ValueError("OpenRouter Base URL not found. Please set it in the .env file.")
if not openrouter_modelname:
    raise ValueError("OpenRouter Model Name not found. Please set it in the .env file.")

# Define the chatbot's persona and instructions
SYSTEM_PROMPT = (
    "You are a friendly and knowledgeable assistant specializing in plant diseases. "
    "Your name is 'Leafy'. Your goal is to help users identify and understand plant health issues "
    "based on the information they provide. "
    "When a disease is identified, provide clear, actionable advice. "
    "Always be encouraging and use language that is easy for a non-expert to understand. "
    "If you are given a confidence score, you can mention it to the user. "
    "Structure your answers with clear headings (e.g., 'Symptoms', 'Cause', 'Treatment')."
    "Always respond in English, regardless of the user's input language."
)

# Initialize the LLM for OpenRouter
llm = ChatOpenAI(
    model=openrouter_modelname,
    base_url=openrouter_base_url,
    api_key=openrouter_api_key,
    temperature=0.7,
)


def get_llm_response(prompt: str, history: list) -> str:
    try:
        # Construct the full message list
        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            *history,
            HumanMessage(content=prompt),
        ]
        response = llm.invoke(messages)
        return response.content
    except Exception as e:
        print(f"An error occurred while communicating with the LLM: {e}")
        return "Sorry, I couldn't process your request at the moment."
