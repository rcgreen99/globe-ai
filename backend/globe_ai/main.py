from fastapi import FastAPI
from dotenv import load_dotenv
from globe_ai.types import Conversation

from globe_ai.agent import GlobeAgent

app = FastAPI()

load_dotenv()


@app.get("/health_check")
def health_check():
    return {"status": "ok"}


@app.post("/conversations/messages")
async def send_message(
    user_input: str,
    latitude: float,
    longitude: float,
    conversation: Conversation | None = None,
):
    agent = GlobeAgent.from_config_path("globe_ai/configs/agent.toml")
    response = await agent.generate_response(
        user_input=user_input,
        latitude=latitude,
        longitude=longitude,
        conversation=conversation,
    )
    return {"response": response}
