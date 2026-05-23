from fastapi import FastAPI
from dotenv import load_dotenv

from globe_ai.agent import GlobeAgent

app = FastAPI()

load_dotenv()


@app.get("/health_check")
def health_check():
    return {"status": "ok"}


@app.get("/describe_location")
async def describe_location(user_input: str, latitude: float, longitude: float):
    agent = GlobeAgent.from_config_path("globe_ai/configs/agent.toml")
    agent_response = await agent.generate_response(user_input, latitude, longitude)
    return {"response": agent_response}
