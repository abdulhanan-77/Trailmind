from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from app.core.state import AgentState
from app.core.llm import get_llm
from app.agents.tools import search_products, get_product_details, list_categories
import json

def concierge_node(state: AgentState):
    """
    Concierge Node:
    - Uses Local Tool calling loop to answer user queries about products.
    """
    messages = state["messages"]
    llm = get_llm()
    
    # Bind tools suitable for Concierge
    tools = [search_products, get_product_details, list_categories]
    llm_with_tools = llm.bind_tools(tools)
    
    # Simple ReAct Loop (Internal to node for now to keep graph simple)
    # In a full LangGraph migration, we would split this into Model -> ToolNode -> Model
    
    # 1. First Call
    response = llm_with_tools.invoke(messages)
    
    # 2. Check for tool calls
    if response.tool_calls:
        # Append AIMessage with tool calls to history (temporary for this loop)
        tool_messages = [response]
        
        for tool_call in response.tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]
            
            # Execute Tool
            tool_result = "Error: Tool not found"
            if tool_name == "search_products":
                tool_result = search_products.invoke(tool_args)
            elif tool_name == "get_product_details":
                tool_result = get_product_details.invoke(tool_args)
            elif tool_name == "list_categories":
                tool_result = list_categories.invoke(tool_args)
                
            # Create ToolMessage
            tool_messages.append(ToolMessage(
                tool_call_id=tool_call["id"], 
                name=tool_name, 
                content=str(tool_result)
            ))
            
        # 3. Second Call with Tool Outputs
        # Construct a temporary history with visual context
        final_response = llm_with_tools.invoke(messages + tool_messages)
        
        # We return the FINAL response content to the user
        content = final_response.content
        
        # If the tool result was a list of products, we might want to pass raw data for carousel
        # But for now, let's rely on LLM to summarize or we parse the tool output.
        # Ideally, we return the structured data to frontend.
        # Hack: If search_products was called, we can try to extract the data to send to frontend.
        # For this iteration, let's just return the text response. 
        # Future: Pass `data` field in response for Generative UI.
        
        return {"messages": [final_response]} # Append final response to state
        
    return {"messages": [response]}
