from typing import List
from fastapi import APIRouter, HTTPException, Body
from app.core.models import Order
from app.services.data_service import data_service

router = APIRouter()

@router.get("/{user_id}", response_model=List[Order])
def get_user_orders(user_id: str):
    """
    Get all orders for a specific user.
    """
    return data_service.get_orders(user_id)

@router.post("/", response_model=Order)
def create_order(order: Order):
    """
    Create a new order.
    """
    # In a real app, here we would validate stock, process payment, etc.
    return data_service.create_order(order)
