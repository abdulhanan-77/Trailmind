from typing import List
from fastapi import APIRouter
from app.core.models import Category
from app.services.data_service import data_service

router = APIRouter()

@router.get("/", response_model=List[Category])
def get_categories():
    """
    Get all categories.
    """
    return data_service.get_categories()
