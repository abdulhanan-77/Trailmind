from app.core.state import AgentState
from app.core.protocols import PaymentMandate
from langgraph.types import interrupt
import uuid

def transactional_node(state: AgentState):
    """
    Transactional Agent (AP2 + HITL):
    - 1. Creates a Payment Mandate (Proposed)
    - 2. INTERRUPT: Asks User for Confirmation
    - 3. Finalizes Transaction (Captured)
    """
    messages = state["messages"]
    last_message = messages[-1]
    
    # Simple logic: assume the user wants to buy the last discussed item
    # In prod: extract item_id from context
    
    # 1. Create Mandate (Proposed)
    mandate = PaymentMandate(
        buyer_id="user_123",
        total_amount=129.99, # Mock amount
        currency="USD",
        items=[{"name": "TrailBlazer Hiking Boots", "quantity": 1}],
        status="proposed"
    )
    
    # 2. TRIGGER HITL INTERRUPT
    # The graph will PAUSE here. The value returned to the user is the dict below.
    # The user must resume the graph with a response (e.g., "yes" or "no").
    user_approval = interrupt({
        "type": "confirmation_request",
        "mandate": mandate.dict(),
        "query": f"I have prepared a secure transaction for {mandate.total_amount} {mandate.currency}. Do you authorize this payment?"
    })
    
    # 3. Resume & Process Decision
    # (This code runs ONLY after the user responds)
    
    approval_text = str(user_approval).lower()
    
    if "yes" in approval_text or "confirm" in approval_text:
        # Authorize & Capture
        mandate.status = "captured"
        mandate.auth_token = f"auth_{uuid.uuid4().hex[:12]}"
        
        response = {
            "type": "ap2_receipt", # Custom UI component
            "content": "Transaction Successful! Securely processed via Agent Payments Protocol.",
            "data": mandate.dict()
        }
    else:
        mandate.status = "failed"
        response = {
            "type": "text",
            "content": "Transaction cancelled. No charges were made."
        }

    return {"final_response": response}
