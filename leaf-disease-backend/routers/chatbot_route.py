from fastapi import APIRouter, UploadFile, Form, File
from services.chatbot_service import handle_chat_request
import uuid

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


@router.get("/chat_session")
def get_chat_session():
    return uuid.uuid1()


@router.post("/")
def ask_chatbot(session_id: str = Form(...), file: UploadFile | None = File(None), question: str | None = Form(None)):
    return handle_chat_request(session_id=session_id, image=file, question=question)
