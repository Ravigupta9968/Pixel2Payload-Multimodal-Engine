# Pixel2Payload: Multimodal Extraction Engine

Pixel2Payload solves a common engineering bottleneck: turning messy, unstructured visual data (like n8n workflow maps, database schemas, or infrastructure diagrams) into clean, predictable JSON.

Basic OCR just dumps raw text, and feeding an image to a standard LLM usually results in an unpredictable wall of text that breaks frontend components. This project acts as a bridge, combining a vision-capable AI model with strict backend validation to guarantee the output is always a structured, actionable payload.

<img width="977" height="524" alt="image" src="https://github.com/user-attachments/assets/6b3a6789-8937-420b-87ce-2e81bb6aa82a" />
Demo: 👉 https://pixel2payload-multimodal-engine.vercel.app/
<img width="1273" height="622" alt="image_1" src="https://github.com/user-attachments/assets/fb2a72e7-3a47-4215-bb5c-24edf940cad1" />


## ⚠️ The Problem It Solves

If you are building internal tools to document automated pipelines or log system metrics, you can't rely on conversational AI outputs. You need deterministic data.

* **The Input:** An image of a complex n8n automation workflow (e.g., Webhook triggers, HTTP Request nodes, Conditional Logic routers, Postgres integrations).
* **The Problem:** Traditional models return conversational text like: *"I see a flowchart with some purple and green boxes connected by lines..."*
* **The Solution:** Pixel2Payload forces the model to return strict telemetry data: `{"entity_name": "HTTP Request (Get user details)", "type": "API Call", "confidence": 0.98}`.

## ⚙️ How It Works

The application uses a decoupled architecture with an asynchronous Python backend and a React frontend.

```text
[ React Frontend ] --(Image + Prompt)--> [ FastAPI Backend ]
                                                |
                                    (File validation & PIL processing)
                                                |
                                                v
                                [ Google Gemini 3.6 Flash ]
                                (Enforced JSON Generation)
                                                |
                                                v
                                [ Pydantic Validation Layer ]
                                (Checks types, drops hallucinations)
                                                |
                                                v
[ React Dashboard ] <-------(Strictly Typed JSON)-----------+

```

1. **Upload & Ingestion:** The React frontend takes a visual asset and a user prompt, sending them as `multipart/form-data`. The FastAPI backend catches this, validates the file, and uses `Pillow (PIL)` to process the image in memory.
2. **Native JSON Forcing:** The image and prompt are routed to the `gemini-3.6-flash` model via the `google-genai` SDK. Instead of begging the model for JSON via complex prompts, we use Gemini's native `response_mime_type="application/json"` setting.
3. **Strict Schema Enforcement:** Before sending anything back to the client, the raw AI output passes through a `Pydantic` model (`VisualAnalysisResponse`). If the AI hallucinates a field type (like returning a string instead of a float for a confidence score), Pydantic catches the error.
4. **Dynamic UI Rendering:** The React app receives the validated JSON payload and dynamically maps the data into a dark-mode dashboard with confidence progress bars and categorized entity tags.

## 🛠️ Tech Stack & Features

* **AI Engine:** Google Gemini SDK (`google-genai`) using `gemini-3.6-flash` for low-latency multimodal processing.
* **Backend:** Python + FastAPI. Chosen for native async support, handling file uploads and API calls efficiently.
* **Validation:** Pydantic acts as the gatekeeper, ensuring the frontend never receives malformed objects.
* **Frontend:** React (Vite) + Tailwind CSS for a responsive, glassmorphic UI.
* **Image Processing:** Pillow (PIL) for in-memory image manipulation.

**Core Capabilities:**

* **Visual Telemetry Extraction:** Automatically parses multi-tier system diagrams, technical workflows, and charts.
* **Confidence Scoring:** Returns quantified confidence percentages for every extracted entity.
* **Strategic Insights:** Evaluates visual layouts to deliver contextual recommendations, such as fail-safes, error-handling steps, or redundancy improvements.

## 🚀 Local Development Setup

You will need two terminal windows to run the frontend and backend concurrently.

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv

# Activate virtual environment:
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt

# Create a .env file and add your API key:
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env

# Start the server (runs on http://localhost:8000)
python main.py

```

### 2. Frontend (React/Vite)

```bash
cd frontend
npm install

# Start the development server (runs on http://localhost:5173)
npm run dev

```
