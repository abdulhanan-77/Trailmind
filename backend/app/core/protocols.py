from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

# ==========================================
# 🌐 Universal Commerce Protocol (UCP)
# Standardizing Product Data for AI Agents
# ==========================================

class Dimensions(BaseModel):
    width: float
    height: float
    depth: float
    unit: Literal["cm", "in", "mm"] = "cm"

class SustainabilityMetrics(BaseModel):
    score: int = Field(..., ge=0, le=100, description="0-100 sustainability score")
    materials: List[str]
    certifications: List[str]

class UCPProduct(BaseModel):
    """
    Standardized Product Schema compatible with UCP.
    Allows agents to universally understand product attributes.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    currency: str = "USD"
    category: str
    
    # 2026/UCP specific fields
    images: List[str]
    real_time_inventory: int = Field(default=0, description="Available stock")
    sustainability: Optional[SustainabilityMetrics] = None
    compatibility_tags: List[str] = Field(default_factory=list, description="Tags for matching style/usage (e.g. 'modern', 'running')")
    reviews_rating: float = Field(default=0.0, ge=0, le=5)
    reviews_count: int = 0
    
    metadata: Dict[str, Any] = Field(default_factory=dict)

# ==========================================
# 💳 Agent Payments Protocol (AP2)
# Secure AI-Initiated Transactions
# ==========================================

class Party(BaseModel):
    id: str
    role: Literal["buyer", "merchant", "agent"]

class PaymentMandate(BaseModel):
    """
    AP2 Mandate: A cryptographically verifiable intent to purchase.
    In this simulation, we use UUIDs and states to represent the flow.
    """
    mandate_id: str = Field(default_factory=lambda: f"mandate_{uuid.uuid4().hex[:8]}")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: Literal["proposed", "authorized", "captured", "failed"] = "proposed"
    
    buyer_id: str
    total_amount: float
    currency: str
    items: List[Dict[str, Any]] # Simplified line items
    
    # Security / HITL fields
    auth_token: Optional[str] = None # Simulates the "signed" token after human approval
    risk_score: float = 0.0 # 0.0 (Safe) to 1.0 (High Risk)

class TransactionStatus(BaseModel):
    transaction_id: str
    status: Literal["success", "pending", "failed"]
    timestamp: datetime
    details: str
