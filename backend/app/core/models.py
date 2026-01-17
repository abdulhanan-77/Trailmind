from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

# --- Categories ---
class Category(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    image: Optional[str] = None

# --- 3D Spatial Metadata ---
class SpatialMetadata(BaseModel):
    """Metadata for 3D product models - dimensions, bounding box, materials."""
    width_cm: Optional[float] = None
    height_cm: Optional[float] = None
    depth_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    materials: List[str] = []
    # Bounding box for AR placement (in meters)
    bounding_box: Optional[Dict[str, float]] = None  # {"x": 0.3, "y": 0.2, "z": 0.1}


# --- Products ---
class Product(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    price: float
    currency: str = "USD"
    category_id: str
    stock: int
    images: List[str]
    features: List[str] = []
    rating: float = 0.0
    reviews_count: int = 0
    ai_tags: List[str] = []
    # 3D Model fields
    model_3d_url: Optional[str] = None  # URL to .glb file
    spatial_metadata: Optional[SpatialMetadata] = None

# --- Users ---
class UserPreferences(BaseModel):
    style: Optional[str] = None
    sizes: Dict[str, str] = {}

class User(BaseModel):
    id: str
    name: str
    email: str
    role: str # "customer", "admin"
    preferences: UserPreferences = Field(default_factory=UserPreferences)

# --- Orders ---
class OrderItem(BaseModel):
    product_id: str
    quantity: int
    price_at_purchase: float

class Order(BaseModel):
    id: str
    user_id: str
    status: str # "pending", "processing", "shipped", "delivered", "returned"
    items: List[OrderItem]
    total: float
    currency: str = "USD"
    shipping_address: Optional[str] = None
    tracking_number: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
