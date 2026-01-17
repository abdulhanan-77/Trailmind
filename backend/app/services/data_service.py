import json
import os
from typing import List, Optional, Dict
from app.core.models import Product, Category, User, Order

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

class DataService:
    def __init__(self):
        self._products: List[Product] = []
        self._categories: List[Category] = []
        self._users: List[User] = []
        self._orders: List[Order] = []
        self._load_data()

    def _load_data(self):
        """Loads data from JSON files."""
        try:
            with open(os.path.join(DATA_DIR, "products.json"), "r") as f:
                products_data = json.load(f)
                self._products = [Product(**p) for p in products_data]
            
            with open(os.path.join(DATA_DIR, "categories.json"), "r") as f:
                categories_data = json.load(f)
                self._categories = [Category(**c) for c in categories_data]

            with open(os.path.join(DATA_DIR, "users.json"), "r") as f:
                users_data = json.load(f)
                self._users = [User(**u) for u in users_data]
                
            with open(os.path.join(DATA_DIR, "orders.json"), "r") as f:
                orders_data = json.load(f)
                self._orders = [Order(**o) for o in orders_data]
                
        except Exception as e:
            print(f"Error loading data: {e}")
            # Initialize with empty lists if files don't exist or error
            self._products = []
            self._categories = []
            self._users = []
            self._orders = []

    def get_products(self, category_slug: Optional[str] = None) -> List[Product]:
        if category_slug:
            # Find category ID by slug
            category = next((c for c in self._categories if c.slug == category_slug), None)
            if not category:
                return []
            return [p for p in self._products if p.category_id == category.id]
        return self._products

    def get_product_by_id(self, product_id: str) -> Optional[Product]:
        return next((p for p in self._products if p.id == product_id), None)
    
    def get_product_by_slug(self, slug: str) -> Optional[Product]:
        return next((p for p in self._products if p.slug == slug), None)

    def get_categories(self) -> List[Category]:
        return self._categories

    def get_user(self, user_id: str) -> Optional[User]:
        return next((u for u in self._users if u.id == user_id), None)

    def get_orders(self, user_id: str) -> List[Order]:
        return [o for o in self._orders if o.user_id == user_id]

    def create_order(self, order: Order) -> Order:
        self._orders.append(order)
        # In a real app, we would write back to the JSON file here
        self._save_orders()
        return order

    def _save_orders(self):
        """Persists orders back to JSON file."""
        try:
            with open(os.path.join(DATA_DIR, "orders.json"), "w") as f:
                json.dump([o.model_dump(mode='json') for o in self._orders], f, indent=2)
        except Exception as e:
            print(f"Error saving orders: {e}")

# Global instance
data_service = DataService()
