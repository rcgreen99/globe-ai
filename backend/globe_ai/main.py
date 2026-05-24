from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from globe_ai.types import MessageRequest

from globe_ai.agent import GlobeAgent

app = FastAPI()

load_dotenv()


@app.get("/health_check")
def health_check():
    return {"status": "ok"}


@app.post("/conversations/messages")
async def send_message(request: MessageRequest):
    agent = GlobeAgent.from_config_path("globe_ai/configs/agent.toml")
    return StreamingResponse(
        agent.stream_response(
            user_input=request.user_input,
            latitude=request.latitude,
            longitude=request.longitude,
            conversation=request.conversation,
        ),
        media_type="text/plain",
    )
