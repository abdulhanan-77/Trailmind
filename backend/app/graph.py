from typing import Literal
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

from app.core.state import AgentState
from app.agents.supervisor import supervisor_node
from app.agents.concierge import concierge_node
from app.agents.support import support_node
from app.agents.researcher import researcher_node
from app.agents.transactional import transactional_node
from app.agents.retention import retention_node

# 1. Define the Graph
workflow = StateGraph(AgentState)

# 2. Add Nodes
workflow.add_node("supervisor", supervisor_node)
workflow.add_node("concierge", concierge_node)
workflow.add_node("support", support_node)
workflow.add_node("researcher", researcher_node)
workflow.add_node("transactional", transactional_node)
workflow.add_node("retention", retention_node)

# 3. Define Edges
# Supervisor decides where to go next
def route_supervisor(state: AgentState) -> Literal["concierge", "support", "researcher", "transactional"]:
    return state["next_node"]

workflow.add_conditional_edges(
    "supervisor",
    route_supervisor,
    {
        "concierge": "concierge",
        "support": "support",
        "researcher": "researcher",
        "transactional": "transactional"
    }
)

# Agents return to END (for now)
workflow.add_edge("concierge", END)
workflow.add_edge("support", END)
workflow.add_edge("researcher", END)
workflow.add_edge("transactional", END)
workflow.add_edge("retention", END)

# 4. Set Entry Point
workflow.set_entry_point("supervisor")

# 5. Compile with Checkpointer (Required for HITL / interrupt)
memory = MemorySaver()
app_graph = workflow.compile(checkpointer=memory)
