'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import ProductDetailModal from './ProductDetailModal';

// ========================================
// 🎨 SVG Icons
// ========================================
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
);

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

const CubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21 16-9 5-9-5V8l9-5 9 5z" />
        <path d="m3 8 9 5 9-5" />
        <path d="M12 13v9" />
    </svg>
);

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
);

// ========================================
// 🎯 Types
// ========================================
interface ProductCardProps {
    product: Product;
}

// ========================================
// 🛍️ Product Card Component
// ========================================
export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const has3DModel = Boolean(product.model_3d_url);

    return (
        <>
            <div className="group bg-white rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden flex flex-col">
                {/* Image Container - Clickable to product page */}
                <Link href={`/product/${product.slug}`} className="relative aspect-[4/3] bg-slate-50 overflow-hidden block">
                    <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
                        {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                                <span className="text-4xl font-light text-slate-200">No Image</span>
                            </div>
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <div
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={(e) => e.preventDefault()}
                    >
                        <button className="bg-white/90 backdrop-blur p-2 rounded-full shadow-sm text-slate-400 hover:text-red-500 transition-colors">
                            <HeartIcon />
                        </button>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                        <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] uppercase font-semibold tracking-wider text-slate-600 border border-slate-100">
                            {product.category_id.replace('cat_', '')}
                        </span>
                        {/* 3D Badge */}
                        {has3DModel && (
                            <span className="bg-blue-600 text-white px-2 py-1 rounded-lg text-[10px] uppercase font-semibold tracking-wider flex items-center gap-1">
                                <CubeIcon />
                                3D
                            </span>
                        )}
                    </div>

                    {/* Quick View Overlay */}
                    <div
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-10"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsModalOpen(true);
                            }}
                            className="bg-white/95 backdrop-blur px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-white hover:text-blue-600 transition-all flex items-center gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0"
                        >
                            <EyeIcon />
                            {has3DModel ? 'View in 3D' : 'Quick View'}
                        </button>
                    </div>
                </Link>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 mr-3">
                            <Link href={`/product/${product.slug}`}>
                                <h3 className="font-semibold text-slate-900 leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1 hover:text-blue-600">
                                    {product.name}
                                </h3>
                            </Link>
                            <div className="flex items-center gap-1 text-amber-400">
                                <StarIcon />
                                <span className="text-slate-400 text-xs font-medium ml-0.5">
                                    {product.rating.toFixed(1)} ({product.reviews_count})
                                </span>
                            </div>
                        </div>
                        <span className="font-bold text-slate-900 text-lg">${product.price.toFixed(2)}</span>
                    </div>

                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed flex-1">
                        {product.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => addToCart(product)}
                            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl hover:bg-blue-600 active:scale-[0.98] transition-all text-sm font-medium shadow-sm hover:shadow-lg hover:shadow-blue-200"
                        >
                            <CartIcon />
                            Add to Cart
                        </button>
                        <Link
                            href={`/product/${product.slug}`}
                            className="px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-300 transition-all text-slate-500 hover:text-blue-600"
                        >
                            <ArrowRightIcon />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Product Detail Modal (Quick View) */}
            <ProductDetailModal
                product={product}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
