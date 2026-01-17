from langchain_openai import ChatOpenAI
from app.core.config import settings

def get_llm():
    """
    Returns a configured ChatOpenAI instance pointing to OpenRouter.
    """
    return ChatOpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=settings.OPENROUTER_API_KEY,
        model=settings.OPENROUTER_MODEL,
        temperature=0.1
    )
