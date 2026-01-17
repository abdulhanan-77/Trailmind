from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.core.models import Product
from app.services.data_service import data_service

router = APIRouter()

@router.get("/", response_model=List[Product])
def get_products(category: Optional[str] = None, search: Optional[str] = None):
    """
    Get all products, optionally filtered by category slug or search query.
    """
    products = data_service.get_products(category_slug=category)
    
    # Apply search filter if provided
    if search:
        search_lower = search.lower()
        products = [
            p for p in products
            if search_lower in p.name.lower() 
            or search_lower in p.description.lower()
            or any(search_lower in f.lower() for f in p.features)
        ]
    
    return products

@router.get("/slug/{slug}", response_model=Product)
def get_product_by_slug(slug: str):
    """
    Get a specific product by its URL slug.
    """
    product = data_service.get_product_by_slug(slug)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/{product_id}", response_model=Product)
def get_product(product_id: str):
    """
    Get a specific product by ID.
    """
    product = data_service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

