import os
import io
import traceback
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from PIL import Image
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

app = FastAPI(title="VisionParse: Gemini Extraction Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize 
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("Warning: GEMINI_API_KEY environment variable not set.")
client = genai.Client(api_key=api_key) if api_key else None

class ExtractedEntity(BaseModel):
    entity_name: str
    entity_type: str = Field(description="e.g., node, connection, data stream, financial metric")
    confidence_score: float
    description: str

class VisualAnalysisResponse(BaseModel):
    summary: str
    identified_entities: List[ExtractedEntity]
    suggested_actions: Optional[List[str]] = None

@app.post("/extract")
async def extract_data(
    query: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File provided is not an image.")

        if client is None:
            raise HTTPException(status_code=500, detail="Gemini client not configured. Set GEMINI_API_KEY.")

        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))

        system_instruction = """
        You are an expert multimodal extraction agent. Analyze the provided image and query.
        You MUST return a valid JSON object matching this exact schema:
        {
            "summary": "string",
            "identified_entities": [
                {
                    "entity_name": "string",
                    "entity_type": "string",
                    "confidence_score": 0.0,
                    "description": "string"
                }
            ],
            "suggested_actions": ["string", "string"]
        }
        """

        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=[system_instruction, query, image],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1
            )
        )
        
        raw_text = response.text.strip()
        print("\n--- RAW OUTPUT ---")
        print(raw_text)
        validated_data = VisualAnalysisResponse.model_validate_json(raw_text)
        return validated_data

    except Exception as e:
        print("\n--- ERROR LOG ---")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)