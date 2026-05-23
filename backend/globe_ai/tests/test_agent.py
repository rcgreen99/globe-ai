from globe_ai.agent import GlobeAgent


async def test_agent():
    agent = GlobeAgent.from_config_path("globe_ai/configs/agent.toml")
    response = await agent.generate_response("What is this place?", 30.2672, 97.7431)
    assert response is not None
    print(response)
    assert "Austin" in response
