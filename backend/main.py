from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os
import json
import ssl
ssl._create_default_https_context = ssl._create_unverified_context
os.environ["PATH"] += os.pathsep + "/opt/homebrew/bin"

load_dotenv()
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class TranscriptRequest(BaseModel):
    transcript: str
    meeting_type: str

@app.get("/health")
def health_check():
    return {"status": "Sprintlog is running"}

def get_meeting_prompt(transcript: str, meeting_type: str) -> str:
    base_structure = '''{{
  "summary": "3-4 sentence summary",
  "participants": ["name1", "name2"],
  "action_items": [{{"task": "task description", "assignee": "person name", "due_date": "mentioned date or null", "priority": "High/Medium/Low", "notes": "any additional context"}}],
  "blockers": [{{"blocker": "description", "raised_by": "person", "owner": "who should fix it", "follow_up_date": "suggested date or null"}}],
  "decisions": ["decision 1"],
  "open_questions": ["question 1"],
  "health_score": {{"tasks": 0, "blockers": 0, "decisions": 0, "open_questions": 0}}
}}'''
    prompts = {
        "standup": f"You are an expert meeting analyst for software startups.\nAnalyse this daily standup transcript and return ONLY a JSON object with no extra text.\nPay close attention to any deadlines, scheduled events, or dates mentioned.\n\nTranscript:\n{transcript}\n\nReturn this exact JSON structure:\n{base_structure}",
        "sprint": f"You are an expert meeting analyst for software startups.\nAnalyse this sprint planning transcript and return ONLY a JSON object with no extra text.\nPay close attention to any deadlines, scheduled events, or dates mentioned — capture all of them as action items with their due dates.\n\nTranscript:\n{transcript}\n\nReturn this exact JSON structure:\n{base_structure}",
        "product_review": f"You are an expert meeting analyst for software startups.\nAnalyse this product review transcript and return ONLY a JSON object with no extra text.\nPay close attention to any deadlines, scheduled events, or dates mentioned.\n\nTranscript:\n{transcript}\n\nReturn this exact JSON structure:\n{base_structure}",
        "client_call": f"You are an expert meeting analyst for software startups.\nAnalyse this client call transcript and return ONLY a JSON object with no extra text.\nPay close attention to any commitments, promises, or deadlines mentioned.\n\nTranscript:\n{transcript}\n\nReturn this exact JSON structure:\n{base_structure}"
    }
    return prompts.get(meeting_type, prompts["standup"])

@app.post("/analyse")
def analyse_meeting(request: TranscriptRequest):
    if not request.transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript cannot be empty")
    if request.meeting_type not in ["standup", "sprint", "product_review", "client_call"]:
        raise HTTPException(status_code=400, detail="Invalid meeting type")
    try:
        prompt = get_meeting_prompt(request.transcript, request.meeting_type)
        response = client.chat.completions.create(model="llama-3.3-70b-versatile", messages=[{"role": "user", "content": prompt}], temperature=0.1)
        raw_output = response.choices[0].message.content
        clean_output = raw_output.strip()
        if clean_output.startswith("```json"): clean_output = clean_output[7:]
        if clean_output.startswith("```"): clean_output = clean_output[3:]
        if clean_output.endswith("```"): clean_output = clean_output[:-3]
        clean_output = clean_output.strip()
        result = json.loads(clean_output)
        result["meeting_type"] = request.meeting_type
        return result
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid format. Try again.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Something went wrong: {str(e)}")