from typing import TypedDict, Annotated, List, Union, Dict, Any
from langchain_core.messages import BaseMessage
import operator

class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    next_node: str
    final_response: Dict[str, Any] # To pass structured UI updates back
