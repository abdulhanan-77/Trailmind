export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image?: string;
}

// 3D Spatial Metadata for AR/3D viewing
export interface SpatialMetadata {
    width_cm?: number;
    height_cm?: number;
    depth_cm?: number;
    weight_kg?: number;
    materials?: string[];
    bounding_box?: { x: number; y: number; z: number };
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    category_id: string;
    category?: string; // Mapped category name
    stock: number;
    images: string[];
    features: string[];
    rating: number;
    reviews_count: number;
    ai_tags: string[];
    // 3D Model fields
    model_3d_url?: string;
    spatial_metadata?: SpatialMetadata;
}

export interface OrderItem {
    product_id: string;
    quantity: number;
    price_at_purchase: number;
}

export interface Order {
    id: string;
    user_id: string;
    status: string;
    items: OrderItem[];
    total: number;
    currency: string;
    shipping_address?: string;
    tracking_number?: string;
    created_at: string;
}
