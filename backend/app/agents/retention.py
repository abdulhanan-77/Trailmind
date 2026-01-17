from app.core.state import AgentState

def retention_node(state: AgentState):
    """
    Retention Agent:
    - Offers discounts if user seems hesitant.
    - Triggered by specific routing logic.
    """
    
    # In a real app, we check state["history"] for repeated views
    
    response = {
        "type": "offer_card",
        "content": "I noticed you're looking at the Hiking Boots again!",
        "offer_details": {
            "discount": "10%",
            "code": "HIKE2026",
            "expiry": "1 hour"
        }
    }
    
    return {"final_response": response}
