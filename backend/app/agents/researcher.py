from app.core.state import AgentState
from langchain_core.messages import AIMessage
import random

# Simulating a Search Tool (e.g., Tavily or Google)
# In a real app, you'd import `TavilySearchResults` from langchain_community
class MockSearchTool:
    def search(self, query: str):
        # Mocking external data capabilities
        # This simulates finding "better deals" or "reviews" from the web
        return [
            {
                "url": "https://competitor-store.com/shoes",
                "content": "Competitor X sells similar shoes for $110. They have mixed reviews about durability."
            },
            {
                "url": "https://review-site.com/best-running-shoes",
                "content": "The top pick for 2026 is the UltraRun 500, but it costs $180. Alpine series is best value."
            }
        ]

search_tool = MockSearchTool()

def researcher_node(state: AgentState):
    """
    Deep Researcher Node:
    - Performs comparative research.
    - Adds an analytical layer to product queries.
    """
    messages = state["messages"]
    last_message = messages[-1]
    query = last_message.content
    
    # 1. Resolve Context (Simple Heuristic for now, or pass history to LLM)
    history_msgs = messages[-4:-1] if len(messages) > 1 else []
    history_text = "\n".join([f"{m.type}: {m.content}" for m in history_msgs])
    
    full_query = f"Context: {history_text}\nQuery: {query}"

    # 2. "Perform" Research
    results = search_tool.search(full_query)
    
    # 3. Synthesize Findings (Mock LLM synthesis)
    # in prod we would pass the history to the LLM here too
    
    # Check if "it" or "boots" refers to previous items (Mock logic)
    subject = "the item"
    if "boots" in history_text.lower() or "boots" in query.lower():
        subject = "TrailBlazer Boots"
    elif "jacket" in history_text.lower() or "jacket" in query.lower():
        subject = "Alpine Explorer Jacket"
        
    comparison_text = (
        f"Research Report for '{query}'\n\n"
        f"I analyzed current market trends for {subject} and found:\n"
        f"- Price Check: Competitors are pricing similar items around $110-$180.\n"
        f"- Durability: Our '{subject}' has a higher sustainability score (92/100) compared to market average (60/100).\n"
        f"- Recommendation: If you value longevity, this is the better investment despite the price.\n"
    )
    
    from app.core.utils import clean_text
    clean_response = clean_text(comparison_text)
    
    response = {
        "type": "text",
        "content": clean_response
    }
    
    return {"final_response": response}
