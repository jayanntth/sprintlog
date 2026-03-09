from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class TranscriptRequest(BaseModel):
    transcript: str
    meeting_type: str

@app.get("/health")
def health_check():
    return {"status": "Sprintlog is running"}    

def get_meeting_prompt(transcript: str, meeting_type: str) -> str:
    prompts = {
        "standup": f"""
You are an expert meeting analyst for software startups.
Analyse this daily standup transcript and return ONLY a JSON object with no extra text.

Transcript:
{transcript}

Return this exact JSON structure:
{{
  "summary": "3-4 sentence summary of the standup",
  "participants": ["name1", "name2"],
  "action_items": [
    {{"task": "task description", "assignee": "person name", "due_date": "mentioned date or null", "priority": "High/Medium/Low"}}
  ],
  "blockers": [
    {{"blocker": "description", "raised_by": "person", "owner": "who should fix it", "follow_up_date": "suggested date"}}
  ],
  "decisions": ["decision 1", "decision 2"],
  "open_questions": ["question 1", "question 2"],
  "health_score": {{"tasks": 0, "blockers": 0, "decisions": 0, "open_questions": 0}}
}}
""",
        "sprint": f"""
You are an expert meeting analyst for software startups.
Analyse this sprint planning transcript and return ONLY a JSON object with no extra text.

Transcript:
{transcript}

Return this exact JSON structure:
{{
  "summary": "3-4 sentence summary of sprint goals",
  "participants": ["name1", "name2"],
  "action_items": [
    {{"task": "task description", "assignee": "person name", "due_date": "mentioned date or null", "priority": "High/Medium/Low"}}
  ],
  "blockers": [
    {{"blocker": "description", "raised_by": "person", "owner": "who should fix it", "follow_up_date": "suggested date"}}
  ],
  "decisions": ["decision 1", "decision 2"],
  "open_questions": ["question 1", "question 2"],
  "health_score": {{"tasks": 0, "blockers": 0, "decisions": 0, "open_questions": 0}}
}}
""",
        "product_review": f"""
You are an expert meeting analyst for software startups.
Analyse this product review transcript and return ONLY a JSON object with no extra text.

Transcript:
{transcript}

Return this exact JSON structure:
{{
  "summary": "3-4 sentence summary of what was reviewed and key outcomes",
  "participants": ["name1", "name2"],
  "action_items": [
    {{"task": "task description", "assignee": "person name", "due_date": "mentioned date or null", "priority": "High/Medium/Low"}}
  ],
  "blockers": [
    {{"blocker": "description", "raised_by": "person", "owner": "who should fix it", "follow_up_date": "suggested date"}}
  ],
  "decisions": ["decision 1", "decision 2"],
  "open_questions": ["question 1", "question 2"],
  "health_score": {{"tasks": 0, "blockers": 0, "decisions": 0, "open_questions": 0}}
}}
""",
        "client_call": f"""
You are an expert meeting analyst for software startups.
Analyse this client call transcript and return ONLY a JSON object with no extra text.

Transcript:
{transcript}

Return this exact JSON structure:
{{
  "summary": "3-4 sentence summary of the call and outcomes",
  "participants": ["name1", "name2"],
  "action_items": [
    {{"task": "task description", "assignee": "person name", "due_date": "mentioned date or null", "priority": "High/Medium/Low"}}
  ],
  "blockers": [
    {{"blocker": "description", "raised_by": "person", "owner": "who should fix it", "follow_up_date": "suggested date"}}
  ],
  "decisions": ["decision 1", "decision 2"],
  "open_questions": ["question 1", "question 2"],
  "health_score": {{"tasks": 0, "blockers": 0, "decisions": 0, "open_questions": 0}}
}}
"""
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
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1,
        )
        
        raw_output = response.choices[0].message.content
        
        clean_output = raw_output.strip()
        if clean_output.startswith("```json"):
            clean_output = clean_output[7:]
        if clean_output.startswith("```"):
            clean_output = clean_output[3:]
        if clean_output.endswith("```"):
            clean_output = clean_output[:-3]
        clean_output = clean_output.strip()
        
        result = json.loads(clean_output)
        
        result["meeting_type"] = request.meeting_type
        
        return result
    
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid format. Try again.")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Something went wrong: {str(e)}")