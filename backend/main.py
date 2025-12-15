from typing import Union

from agent import GlobeAgent
from fastapi import FastAPI
from dotenv import load_dotenv
from pydantic import BaseModel

app = FastAPI()

load_dotenv()


class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None


@app.get("/health_check")
def health_check():
    return {"status": "ok"}


@app.get("/describe_location")
async def describe_location(user_input: str, latitude: float, longitude: float):
    agent = GlobeAgent.from_config_path("backend/configs/agent.toml")
    agent_response = await agent.generate_response(user_input, latitude, longitude)
    return {"response": agent_response}
