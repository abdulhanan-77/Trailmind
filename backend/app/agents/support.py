from langchain_core.messages import HumanMessage, ToolMessage
from app.core.state import AgentState
from app.core.llm import get_llm
from app.agents.tools import check_order_status

def support_node(state: AgentState):
    """
    Support Node:
    - Handles order status and returns.
    """
    messages = state["messages"]
    llm = get_llm()
    
    tools = [check_order_status]
    llm_with_tools = llm.bind_tools(tools)
    
    response = llm_with_tools.invoke(messages)
    
    if response.tool_calls:
        tool_messages = [response]
        for tool_call in response.tool_calls:
            if tool_call["name"] == "check_order_status":
                res = check_order_status.invoke(tool_call["args"])
                tool_messages.append(ToolMessage(
                    tool_call_id=tool_call["id"],
                    name=tool_call["name"],
                    content=str(res)
                ))
        
        final_response = llm_with_tools.invoke(messages + tool_messages)
        return {"messages": [final_response]}

    return {"messages": [response]}
