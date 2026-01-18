"""
Stripe Checkout API Endpoints
Handles payment processing with Stripe in test mode.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.config import settings
import stripe

# ========================================
# 🔧 Configuration
# ========================================
stripe.api_key = settings.STRIPE_SECRET_KEY

router = APIRouter()

# ========================================
# 📦 Request/Response Models
# ========================================
class CartItem(BaseModel):
    id: str
    name: str
    price: float
    quantity: int
    image: Optional[str] = None

class CheckoutRequest(BaseModel):
    items: List[CartItem]
    success_url: str
    cancel_url: str

class CheckoutResponse(BaseModel):
    session_id: str
    checkout_url: str

class PaymentIntentRequest(BaseModel):
    amount: int  # Amount in cents
    currency: str = "usd"

class PaymentIntentResponse(BaseModel):
    client_secret: str
    payment_intent_id: str

# ========================================
# 🛒 Checkout Endpoints
# ========================================

@router.post("/create-checkout-session", response_model=CheckoutResponse)
async def create_checkout_session(request: CheckoutRequest):
    """
    Create a Stripe Checkout Session for the cart items.
    Returns a URL to redirect the user to Stripe's hosted checkout page.
    """
    if not stripe.api_key:
        raise HTTPException(
            status_code=500, 
            detail="Stripe is not configured. Add STRIPE_SECRET_KEY to .env"
        )
    
    try:
        # Build line items for Stripe
        line_items = []
        for item in request.items:
            line_items.append({
                "price_data": {
                    "currency": "usd",
                    "unit_amount": int(item.price * 100),  # Convert to cents
                    "product_data": {
                        "name": item.name,
                        "images": [item.image] if item.image else [],
                    },
                },
                "quantity": item.quantity,
            })
        
        # Create checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=request.success_url,
            cancel_url=request.cancel_url,
        )
        
        return CheckoutResponse(
            session_id=session.id,
            checkout_url=session.url
        )
        
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Checkout failed: {str(e)}")


@router.post("/create-payment-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(request: PaymentIntentRequest):
    """
    Create a Payment Intent for custom payment forms.
    Used with Stripe Elements on the frontend.
    """
    if not stripe.api_key:
        raise HTTPException(
            status_code=500,
            detail="Stripe is not configured. Add STRIPE_SECRET_KEY to .env"
        )
    
    try:
        intent = stripe.PaymentIntent.create(
            amount=request.amount,
            currency=request.currency,
            automatic_payment_methods={"enabled": True},
        )
        
        return PaymentIntentResponse(
            client_secret=intent.client_secret,
            payment_intent_id=intent.id
        )
        
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/config")
async def get_stripe_config():
    """
    Return the Stripe publishable key for frontend initialization.
    """
    publishable_key = settings.STRIPE_PUBLISHABLE_KEY
    
    if not publishable_key:
        raise HTTPException(
            status_code=500,
            detail="Stripe publishable key not configured"
        )
    
    return {"publishable_key": publishable_key}


@router.get("/session/{session_id}")
async def get_session_status(session_id: str):
    """
    Get the status of a checkout session (for success page).
    """
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        return {
            "status": session.status,
            "payment_status": session.payment_status,
            "customer_email": session.customer_details.email if session.customer_details else None,
            "amount_total": session.amount_total / 100 if session.amount_total else 0,
        }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
