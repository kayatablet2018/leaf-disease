from dotenv import load_dotenv
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import chatbot_route
import os

load_dotenv()
os.makedirs("static", exist_ok=True)

app = FastAPI(
    title="API Chatbot",
    description="API Chatbot",
    version="1.0",
    docs_url="/swagger",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS", "PUT", "PATCH"],
    allow_headers=["Content-Type", "Authorization"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(chatbot_route.router)


@app.get("/")
def health_check():
    return "API is working. Go /swagger"


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=5001)
