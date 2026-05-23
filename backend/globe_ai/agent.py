from __future__ import annotations
from pathlib import Path

from anthropic import AsyncAnthropic
from jinja2 import Template
from pydantic import BaseModel

from globe_ai.configurable import Configurable


class GlobeAgent(Configurable):
    class Config(BaseModel):
        system_message_path: Path
        user_message_path: Path

    def __init__(self, system_prompt: str, user_prompt: str) -> None:
        self.system_prompt = system_prompt
        self.user_prompt = user_prompt

        self.client = AsyncAnthropic()

    @classmethod
    def from_config(cls, config: GlobeAgent.Config) -> GlobeAgent:
        system_prompt = config.system_message_path.read_text()
        user_prompt = config.user_message_path.read_text()
        return cls(system_prompt=system_prompt, user_prompt=user_prompt)

    async def generate_response(
        self, user_input: str, latitude: float, longitude: float
    ) -> str:
        # Render prompts
        system_prompt = Template(self.system_prompt).render()
        user_prompt = Template(self.user_prompt).render(
            user_input=user_input, latitude=latitude, longitude=longitude
        )

        # Call client with streaming
        async with self.client.messages.stream(
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": user_prompt,
                }
            ],
            model="claude-sonnet-4-5-20250929",
            system=system_prompt,
        ) as stream:
            async for event in stream:
                if event.type == "text":
                    print(event.text, end="", flush=True)
                elif event.type == "content_block_stop":
                    print()
                    print("\ncontent block finished accumulating:", event.content_block)

        accumulated = await stream.get_final_message()
        print("accumulated message: ", accumulated.to_json())
        return accumulated
