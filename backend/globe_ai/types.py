from typing import Literal
from pydantic import BaseModel


class Turn(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class Conversation(BaseModel):
    turns: list[Turn]

    def to_messages(self) -> list[dict[str, str]]:
        return [
            {
                "role": turn.role,
                "content": turn.content,
            }
            for turn in self.turns
        ]


class MessageRequest(BaseModel):
    user_input: str
    latitude: float
    longitude: float
    conversation: Conversation | None = None
