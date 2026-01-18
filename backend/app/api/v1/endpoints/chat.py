from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, Optional
from app.graph import app_graph

router = APIRouter()

@router.post("/clear")
async def clear_chat(payload: Dict[str, Any]):
    """
    Clear the chat thread context.
    Accepts: { "session_id": "uuid" }
    """
    thread_id = payload.get("session_id", "default_thread")
    config = {"configurable": {"thread_id": thread_id}}
    
    try:
        # To "clear" in LangGraph with MemorySaver, we can effectively reset by overwriting the state
        # with an empty list of messages, or just rely on the frontend to generate a NEW session_id.
        # However, to truly clear the checkpointer's memory for that ID:
        await app_graph.aupdate_state(config, {"messages": [], "final_response": None})
        return {"status": "cleared", "thread_id": thread_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear chat: {str(e)}")

@router.post("/message")
async def chat_message(
    message: Dict[str, Any]
):
    """
    Primary chat endpoint.
    Accepts: { "message": "user input", "session_id": "uuid" }
    Returns: JSON response (Stream later)
    """
    user_text = message.get("message", "")
    
    # LangGraph Execution
    from langchain_core.messages import HumanMessage
    
    # Use session_id as thread_id for persistence
    thread_id = message.get("session_id", "default_thread")
    config = {"configurable": {"thread_id": thread_id}}
    
    # Check if we are resuming from an interrupt (user said "yes"/"no" after approval request)
    # Get current state
    current_state = await app_graph.aget_state(config)
    
    if current_state.next and len(current_state.next) > 0:
        # If there are next steps halted (interrupt), we resume!
        # We pass None as input to resume execution from the interrupt point
        # But we need to inject the user's decision into the interrupt return value.
        # LangGraph "update_state" or "resume" pattern:
        # For simple Command(resume=...) pattern:
        from langgraph.types import Command
        
        # We interpret the user's message as the "value" to resume with
        result = await app_graph.ainvoke(Command(resume=user_text), config=config)
    else:
        # Standard flow: start new run
        inputs = {"messages": [HumanMessage(content=user_text)]}
        result = await app_graph.ainvoke(inputs, config=config)
    
    # Extract final response from state
    final_response = result.get("final_response", {
        "type": "text", 
        "content": "I'm processing your request..."
    })
    
    return final_response
