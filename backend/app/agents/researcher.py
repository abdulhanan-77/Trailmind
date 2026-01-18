from app.core.state import AgentState
from app.core.llm import get_llm
from app.agents.tools import web_search, search_products
from langchain_core.messages import HumanMessage
import json

def serialize_products(products) -> str:
    """Convert Product objects to a clean JSON string for LLM context."""
    if not products:
        return "[]"
    
    serialized = []
    for p in products[:5]:  # Limit to top 5 to avoid context overflow
        serialized.append({
            "id": p.id,
            "name": p.name,
            "slug": p.slug,
            "price": p.price,
            "description": p.description[:200],  # Truncate long descriptions
            "features": p.features[:4] if p.features else [],
            "rating": p.rating
        })
    return json.dumps(serialized, indent=2)

def researcher_node(state: AgentState):
    """
    Expert Researcher Agent:
    - Uses Broad Search (web) and Deep Knowledge (internal DB) to compare products.
    - Properly serializes internal products and prevents hallucination.
    """
    messages = state["messages"]
    last_message = messages[-1]
    query = last_message.content
    
    llm = get_llm()
    
    # 1. Extract search keywords from user query
    extraction_prompt = f"""From the user query: '{query}', extract 1-3 key product types or names to search.
    Examples: "boots", "jacket parka", "trailblazer"
    Output ONLY the keywords, no explanation."""
    
    search_keywords = llm.invoke([HumanMessage(content=extraction_prompt)]).content.strip()
    
    # 2. Execute Internal Search FIRST
    internal_products = search_products.invoke({"query": search_keywords})
    internal_json = serialize_products(internal_products)
    
    # 3. Execute Web Search for competitors
    web_query = f"best {search_keywords} 2024 price comparison reviews"
    external_data = web_search.invoke(web_query)
    
    # 4. Synthesize Comparison with STRICT anti-hallucination prompt
    comparison_prompt = f"""You are a product comparison analyst.

USER QUERY: {query}

=== OUR INTERNAL INVENTORY (USE EXACTLY AS PROVIDED) ===
{internal_json}

=== EXTERNAL MARKET DATA ===
{external_data}

STRICT RULES:
1. For OUR products: Use ONLY the exact id, name, slug, and price from the inventory above. DO NOT make up products.
2. If no internal products match, say "No matching internal product" but still show competitors.
3. Extract 2-3 competitor products from the external data with real prices.

OUTPUT FORMAT (valid JSON only):
{{
    "content": "Brief comparison summary (2-3 sentences)",
    "type": "product_carousel",
    "data": [
        {{
            "id": "competitor_1",
            "name": "Competitor Name",
            "price": 123.99,
            "description": "Key differentiator",
            "url": "search_result_url_if_available"
        }},
        {{
            "id": "EXACT_ID_FROM_INVENTORY",
            "name": "EXACT_NAME_FROM_INVENTORY", 
            "price": EXACT_PRICE_FROM_INVENTORY,
            "description": "Our advantage",
            "slug": "EXACT_SLUG_FROM_INVENTORY"
        }}
    ]
}}"""
    
    try:
        raw_response = llm.invoke([HumanMessage(content=comparison_prompt)]).content
        
        # Extract JSON from response
        json_str = raw_response.strip()
        if "```json" in json_str:
            json_str = json_str.split("```json")[1].split("```")[0].strip()
        elif "```" in json_str:
            json_str = json_str.split("```")[1].split("```")[0].strip()
            
        data = json.loads(json_str)
        return {"final_response": data}
        
    except Exception as e:
        # Fallback with basic info
        return {
            "final_response": {
                "type": "text",
                "content": f"Research on '{query}': Found {len(internal_products)} internal products. Market data: {external_data[:400]}..."
            }
        }
