from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from odds_model import calculate_odds

app = FastAPI(title="Odds Generator API", version="1.0.0")

class MatchInput(BaseModel):
    teamA: str
    teamB: str
    teamA_rating: float
    teamB_rating: float

class MatchOutput(BaseModel):
    teamA: str
    teamB: str
    odds: dict

class BatchMatchInput(BaseModel):
    matches: List[MatchInput]

class BatchMatchOutput(BaseModel):
    results: List[MatchOutput]

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Math Helper is healthy!"}

@app.post("/generate-odds", response_model=MatchOutput)
def generate_odds(match: MatchInput):
    odds = calculate_odds(match.teamA_rating, match.teamB_rating)
    return {
        "teamA": match.teamA,
        "teamB": match.teamB,
        "odds": odds
    }

@app.post("/generate-odds-batch", response_model=BatchMatchOutput)
def generate_odds_batch(batch: BatchMatchInput):
    results = []
    for match in batch.matches:
        odds = calculate_odds(match.teamA_rating, match.teamB_rating)
        results.append({
            "teamA": match.teamA,
            "teamB": match.teamB,
            "odds": odds
        })
    return {"results": results}
