import { notFound } from 'next/navigation';
import { fetchProductBySlug, fetchProducts } from '@/lib/api';
import ProductDetailClient from './ProductDetailClient';

// ========================================
// 📄 Product Detail Page (Server Component)
// ========================================

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;

    let product;
    try {
        product = await fetchProductBySlug(slug);
    } catch {
        notFound();
    }

    // Fetch related products (same category, exclude current)
    let relatedProducts = [];
    try {
        const categorySlug = product.category_id.replace('cat_', '');
        const allProducts = await fetchProducts(categorySlug);
        relatedProducts = allProducts
            .filter(p => p.id !== product.id)
            .slice(0, 4);
    } catch {
        // Silently fail for related products
    }

    return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}

// Generate static params for common products (optional optimization)
export async function generateStaticParams() {
    try {
        const products = await fetchProducts();
        return products.slice(0, 10).map(p => ({ slug: p.slug }));
    } catch {
        return [];
    }
}
