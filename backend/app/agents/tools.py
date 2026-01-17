from typing import List, Optional
from langchain_core.tools import tool
from app.services.data_service import data_service
from app.core.models import Product, Order

@tool
def search_products(query: str, category: Optional[str] = None) -> List[Product]:
    """
    Search for products by query text and optionally filter by category slug.
    Useful for finding products when a user asks for 'jackets', 'camping gear', etc.
    """
    all_products = data_service.get_products(category_slug=category)
    if not query:
        return all_products
    
    # Simple case-insensitive search
    query = query.lower()
    results = [
        p for p in all_products 
        if query in p.name.lower() or query in p.description.lower() or query in p.slug
    ]
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
