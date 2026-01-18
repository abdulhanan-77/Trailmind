from typing import List, Optional
from langchain_core.tools import tool
from app.services.data_service import data_service
from app.core.models import Product, Order

@tool
def search_products(query: str, category: Optional[str] = None) -> List[Product]:
    """
    Search for products by query text and optionally filter by category slug.
    Useful for finding products when a user asks for 'jackets', 'camping gear', etc.
    Returns a list of matching Product objects with id, name, slug, price, description, and features.
    """
    all_products = data_service.get_products(category_slug=category)
    if not query:
        return all_products
    
    # Improved semantic search: tokenize query and match any word
    query_tokens = set(query.lower().split())
    
    # Also add common synonyms/related terms
    synonym_map = {
        "boots": ["shoes", "footwear", "hiking"],
        "shoes": ["boots", "footwear", "sneakers"],
        "jacket": ["coat", "parka", "shell", "outerwear"],
        "parka": ["jacket", "coat", "down"],
        "shirt": ["top", "tee", "apparel"],
        "pants": ["trousers", "bottoms"],
        "backpack": ["pack", "bag", "rucksack"],
    }
    
    expanded_tokens = set(query_tokens)
    for token in query_tokens:
        if token in synonym_map:
            expanded_tokens.update(synonym_map[token])
    
    results = []
    for p in all_products:
        # Create searchable text from product attributes
        searchable = f"{p.name} {p.description} {p.slug} {' '.join(p.features)}".lower()
        
        # Check if any query token matches
        if any(token in searchable for token in expanded_tokens):
            results.append(p)
    
    return results

@tool
def get_product_details(product_id: str) -> Optional[Product]:
    """
    Get detailed information about a specific product by its ID.
    Useful when a user wants to know more about a specific item.
    """
    return data_service.get_product_by_id(product_id)

@tool
def check_order_status(user_id: str) -> List[Order]:
    """
    Check the status of orders for a specific user ID.
    Useful for support queries like 'where is my order?'.
    """
    return data_service.get_orders(user_id)

@tool
def list_categories() -> List[str]:
    """
    List all available product categories.
    """
    cats = data_service.get_categories()
    return [c.slug for c in cats]

@tool
def web_search(query: str) -> str:
    """
    Search the web for real-time information, competitor prices, and product reviews.
    Use this for deep research and price comparisons.
    """
    try:
        from langchain_community.tools import DuckDuckGoSearchRun
        search = DuckDuckGoSearchRun()
        return search.run(query)
    except Exception as e:
        return f"Web search failed: {str(e)}. Falling back to knowledge base."
