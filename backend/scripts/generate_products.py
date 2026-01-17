import json
import random
import uuid
from pathlib import Path

# Paths
BASE_DIR = Path('backend/app/data')
PRODUCTS_FILE = BASE_DIR / 'products.json'

# Data Sources
ADJECTIVES = ["Alpine", "Urban", "Tactical", "Quantum", "Sonic", "Glacial", "Vortex", "Nomad", "Apex", "Zenith", "Titanium", "Carbon", "Solar", "Lunar", "Stellar", "Aurora", "Nimbus", "Terra", "Hydro", "Aero"]
NOUNS = {
    "cat_outdoor": ["Tent", "Sleeping Bag", "Backpack", "Lantern", "Compass", "Multi-tool", "Hammock", "Cooler", "Stove", "Binoculars"],
    "cat_tech": ["Smartwatch", "Drone", "Solar Charger", "Action Camera", "noise-cancelling Headphones", "Tracker", "Power Bank", "Speaker", "Gimbal", "Sensor"],
    "cat_footwear": ["Hiking Boots", "Trail Runners", "Climbing Shoes", "Sandals", "Trekking Socks", "Approach Shoes", "Winter Boots", "Gaiters"],
    "cat_apparel": ["Jacket", "Parka", "Fleece", "Gloves", "Beanie", "Base Layer", "Rain Shell", "Vest", "Scarf", "Performance Shirt"]
}
DESCRIPTIONS = [
    "Engineered for the most demanding environments.",
    "Lightweight durability meets premium design.",
    "The ultimate companion for your next adventure.",
    "Precision crafted with cutting-edge materials.",
    "Sustainable, robust, and ready for anything.",
    "Experience the future of gear with this innovative design.",
    "Built to withstand the elements and keep you going.",
    "Seamlessly blends style with rugged functionality."
]
IMAGES = {
    "cat_outdoor": [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d",
        "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7"
    ],
    "cat_tech": [
        "https://images.unsplash.com/photo-1518770660439-4636190af475",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944"
    ],
    "cat_footwear": [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
        "https://images.unsplash.com/photo-1512374382149-233c42b6a83b"
    ],
    "cat_apparel": [
        "https://images.unsplash.com/photo-1516762689617-e1cffcef479d",
        "https://images.unsplash.com/photo-1620799140408-ed5341cd2431",
        "https://images.unsplash.com/photo-1551028919-ac7bcb81d8b9"
    ]
}

def generate_products():
    if not PRODUCTS_FILE.exists():
        print(f"Error: {PRODUCTS_FILE} not found.")
        return

    with open(PRODUCTS_FILE, 'r') as f:
        products = json.load(f)

    current_count = len(products)
    target_count = 50
    needed = target_count - current_count

    print(f"Current count: {current_count}. Generating {needed} new products...")

    if needed <= 0:
        print("Target count already met.")
        return

    new_products = []
    
    # Calculate starting index for IDs to avoid collision if they follow pattern
    # Assuming prod_001, prod_002...
    last_id_num = 0
    for p in products:
        try:
            num = int(p['id'].split('_')[1])
            if num > last_id_num: last_id_num = num
        except:
            pass

    categories = list(NOUNS.keys())

    for i in range(needed):
        cat_id = random.choice(categories)
        adj = random.choice(ADJECTIVES)
        noun = random.choice(NOUNS[cat_id])
        name = f"{adj} {noun}"
        slug = name.lower().replace(' ', '-')
        
        # Ensure unique name if possible (simple check)
        if any(p['name'] == name for p in products + new_products):
            adj2 = random.choice(ADJECTIVES)
            name = f"{adj} {adj2} {noun}"
            slug = name.lower().replace(' ', '-')

        price = round(random.uniform(49.99, 499.99), 2)
        stock = random.randint(5, 100)
        rating = round(random.uniform(4.0, 5.0), 1)
        reviews = random.randint(10, 500)
        
        # Image
        base_img = random.choice(IMAGES[cat_id])
        # Add random query param to avoid duplicate caching in browser if URLs are identical
        img_url = f"{base_img}?auto=format&fit=crop&w=800&q=80&id={random.randint(1000, 9999)}"

        new_prod = {
            "id": f"prod_{last_id_num + i + 1:03d}",
            "name": name,
            "slug": slug,
            "description": random.choice(DESCRIPTIONS),
            "price": price,
            "currency": "USD",
            "category_id": cat_id,
            "stock": stock,
            "images": [img_url],
            "features": ["Premium Quality", "Durable", "Eco-friendly", "Warranty"],
            "rating": rating,
            "reviews_count": reviews
        }
        new_products.append(new_prod)

    all_products = products + new_products
    
    with open(PRODUCTS_FILE, 'w') as f:
        json.dump(all_products, f, indent=2)
    
    print(f"Successfully added {len(new_products)} products. Total: {len(all_products)}")

if __name__ == "__main__":
    generate_products()
