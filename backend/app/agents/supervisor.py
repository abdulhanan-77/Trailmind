from typing import Literal
from langchain_core.messages import HumanMessage
from pydantic import BaseModel, Field
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
    
    # Adding more explicit instructions and negative constraints
    system_prompt = """You are the Supervisor for a premium outdoor gear e-commerce store.
    Your job is to route the user to the correct specialist agent.
    
    AGENTS:
    - concierge: For product discovery, recommendations, "show me...", "I need...".
    - researcher: For deep comparisons, specific specs, "is X better than Y?", reviews.
    - support: For post-purchase issues, order status, returns, shipping policy.
    - transactional: ONLY if the user explicitly says "buy", "checkout", "add to cart".
    
    If unsure, route to 'concierge'.
    
    IMPORTANT: You must output ONLY valid JSON matching the schema. Do not include any conversational filler like 'Sure' or 'Here is the decision'."""
    
    prompt_messages = [HumanMessage(content=system_prompt)] + messages
    
    try:
        # Attempt structured output
        decision = router.invoke(prompt_messages)
        next_node = decision.next_node
    except Exception as e:
        print(f"Routing Structured Output Error: {e}. Attempting manual parse...")
        try:
            # Fallback to manual extraction if the model keeps talking
            raw = llm.invoke(prompt_messages).content
            import json
            import re
            # Find something that looks like JSON
            match = re.search(r'\{.*\}', raw, re.DOTALL)
            if match:
                data = json.loads(match.group(0))
                next_node = data.get("next_node", "concierge")
            else:
                next_node = "concierge"
        except:
            next_node = "concierge"
        
    return {"next_node": next_node}
