from typing import Literal
from langchain_core.messages import HumanMessage
from langchain_core.pydantic_v1 import BaseModel, Field
from app.core.state import AgentState
from app.core.llm import get_llm

class RouteDecision(BaseModel):
    """Destination for the next step in the workflow."""
    next_node: Literal["concierge", "support", "researcher", "transactional"] = Field(
        description="The next agent to route the user to based on their intent."
    )

async def supervisor_node(state: AgentState):
    """
    Supervisor Node:
    - Uses Structured Output to route the user.
    """
    messages = state["messages"]
    llm = get_llm()
    
    # We can use a lighter model for routing if available, but for now use the same
    router = llm.with_structured_output(RouteDecision)
    
    system_prompt = """You are the Supervisor for a premium outdoor gear e-commerce store.
    Your job is to route the user to the correct specialist agent.
    
    AGENTS:
    - concierge: For product discovery, recommendations, "show me...", "I need...".
    - researcher: For deep comparisons, specific specs, "is X better than Y?", reviews.
    - support: For post-purchase issues, order status, returns, shipping policy.
    - transactional: ONLY if the user explicitly says "buy", "checkout", "add to cart".
    
    If unsure, route to 'concierge'."""
    
    # Construct prompt with history
    # We pass the messages directly. The model will see the conversation.
    # We append a system message at the start or just rely on the tool definition description?
    # Better to prepend system message.
    
    prompt_messages = [HumanMessage(content=system_prompt)] + messages
    
    try:
        decision = router.invoke(prompt_messages)
        next_node = decision.next_node
    except Exception as e:
        print(f"Routing Error: {e}")
        next_node = "concierge"
        
    return {"next_node": next_node}
