from __future__ import annotations
from collections.abc import AsyncIterator
from pathlib import Path

from anthropic import AsyncAnthropic
from jinja2 import Template
from pydantic import BaseModel

from globe_ai.types import Conversation
from globe_ai.configurable import Configurable


class GlobeAgent(Configurable):
    class Config(BaseModel):
        system_message_path: Path

    def __init__(self, system_prompt: str) -> None:
        self.system_prompt = system_prompt

        self.client = AsyncAnthropic()

    @classmethod
    def from_config(cls, config: GlobeAgent.Config) -> GlobeAgent:
        system_prompt = config.system_message_path.read_text()
        return cls(system_prompt=system_prompt)

    async def generate_response(
        self,
        user_input: str,
        latitude: float,
        longitude: float,
        conversation: Conversation | None = None,
    ) -> str:
        # Render system prompt
        system_prompt = Template(self.system_prompt).render(
            latitude=latitude, longitude=longitude
        )

        messages = conversation.to_messages() if conversation else []

        return await self.client.messages.create(
            max_tokens=1024,
            messages=messages
            + [
                {
                    "role": "user",
                    "content": user_input,
                }
            ],
            model="claude-sonnet-4-5-20250929",
            system=system_prompt,
        )

    async def stream_response(
        self,
        user_input: str,
        latitude: float,
        longitude: float,
        conversation: Conversation | None = None,
    ) -> AsyncIterator[str]:
        # Render system prompt
        system_prompt = Template(self.system_prompt).render(
            latitude=latitude, longitude=longitude
        )

        messages = conversation.to_messages() if conversation else []

        async with self.client.messages.stream(
            max_tokens=1024,
            messages=messages
            + [
                {
                    "role": "user",
                    "content": user_input,
                }
            ],
            model="claude-sonnet-4-5-20250929",
            system=system_prompt,
        ) as stream:
            async for text in stream.text_stream:
                yield text
