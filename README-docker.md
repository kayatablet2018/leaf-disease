# Docker Setup for Leaf Disease App

## Build and Run

```powershell
# Build all containers
docker-compose build

# Start all containers
docker-compose up
```

- Backend: FastAPI, exposed on port 8000
- Frontend: React/Vite, served by Nginx on port 3000

## Useful Commands
```powershell
# Stop containers
docker-compose down

# Rebuild containers
docker-compose up --build
```



## Backend .env File
The backend uses a `.env` file to store sensitive information and configuration parameters. Below are the required parameters based on your current setup:

**Example `leaf-disease-backend/.env` file:**
```env
UPLOAD_DIR=static/uploads
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODELNAME=openai/gpt-oss-20b:free
```

**Parameter descriptions:**
- `UPLOAD_DIR`: Directory path for uploaded files (used for storing images or documents).
- `OPENROUTER_API_KEY`: API key for accessing OpenRouter services. Replace with your own key.
- `OPENROUTER_BASE_URL`: Base URL for OpenRouter API requests.
- `OPENROUTER_MODELNAME`: Model name to use for OpenRouter LLM requests.

**Notes:**
- Do not commit your real `.env` file to version control. Instead, create a `.env.example` file with placeholder values.
- The `.env` file is automatically loaded in Docker and by FastAPI (using python-dotenv or similar).

## Notes
- Static files are mounted for backend.
- Environment variables can be set in docker-compose.yml.
