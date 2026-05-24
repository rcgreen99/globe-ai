import pytest

from globe_ai.types import Conversation
from globe_ai.types import Turn
from globe_ai.agent import GlobeAgent


@pytest.fixture
def conversation():
    return Conversation(
        turns=[
            Turn(role="user", content="What city is this?"),
            Turn(role="assistant", content="Austin"),
        ]
    )


async def test_agent():
    agent = GlobeAgent.from_config_path("globe_ai/configs/agent.toml")
    response = await agent.generate_response("What is this place?", 30.2672, 97.7431)
    assert response is not None
    assert response.content is not None
    assert "Austin" in response.content[0].text


async def test_agent_with_conversation(conversation: Conversation):
    agent = GlobeAgent.from_config_path("globe_ai/configs/agent.toml")
    response = await agent.generate_response(
        "What state is it in?",
        30.2672,
        97.7431,
        conversation=conversation,
    )
    assert response is not None
    assert response.content is not None
    assert "Texas" in response.content[0].text
