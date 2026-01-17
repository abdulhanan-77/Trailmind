from fastapi import APIRouter
from app.api.v1.endpoints import chat, products, categories, orders, checkout

api_router = APIRouter()
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(checkout.router, prefix="/checkout", tags=["checkout"])

