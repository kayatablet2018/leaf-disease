from fastapi import UploadFile
from langchain_core.messages import HumanMessage, AIMessage
from services.leaf_disease_classification_sevice import classification_result
from services.llm_service import get_llm_response
from services.file_service import save_upload_file

# In-memory store for chat histories. In a production environment, 
# you would replace this with a more persistent storage like Redis or a database.
chat_histories = {}

def handle_chat_request(session_id: str, image: UploadFile | None, question: str | None) -> dict:
    if not image and not question:
        return {"response": "Please provide an image, a question, or both.", "classification": None}

    # Retrieve the conversation history for the given session, or start a new one.
    history = chat_histories.get(session_id, [])

    prompt = ""
    response_data = {}

    # --- Image Processing Logic ---
    if image:
        try:
            file_info = save_upload_file(image)
            image_url = file_info.get("static_url")
            classification_data = classification_result(image)
            label = classification_data.get("predicted_class")
            probability = classification_data.get("probability")

            response_data['classification'] = {"label": label, "probability": probability, "image_url": image_url}

            if question:
                prompt = (
                    f"A user has uploaded an image of a plant leaf that has been identified as '{label}' "
                    f"with a confidence of {probability:.2%}. The user's question is: '{question}'. "
                    f"Based on this disease, please provide a helpful and relevant answer to the user's question."
                )
            else:
                prompt = (
                    f"A user has uploaded an image of a plant leaf that has been identified as '{label}' "
                    f"with a confidence of {probability:.2%}. Please provide a detailed description of this plant disease."
                )
        except Exception as e:
            print(f"An error occurred during image processing: {e}")
            return {"response": "I'm sorry, I had trouble analyzing the image.", "classification": None}
    
    # --- Text-Only Logic ---
    elif question:
        response_data['classification'] = None
        prompt = question # For text-only, the prompt is the question itself.

    # --- LLM Call and History Management ---
    if prompt:
        llm_response = get_llm_response(prompt, history)
        response_data["response"] = llm_response
        
        # Update the history for the current session
        chat_histories[session_id] = history + [HumanMessage(content=prompt), AIMessage(content=llm_response)]
    else:
        response_data["response"] = "I'm not sure how to help. Please provide more information."
    
    return response_data