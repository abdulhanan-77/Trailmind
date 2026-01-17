'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import ProductViewer from '@/components/product/ProductViewer';
import ProductSpecs from '@/components/product/ProductSpecs';
import { SizeChartModal, SizeChartButton } from '@/components/product/SizeChart';

// ========================================
// 🎨 Icons
// ========================================
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
);

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6" />
    </svg>
);

const CubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21 16-9 5-9-5V8l9-5 9 5z" /><path d="m3 8 9 5 9-5" /><path d="M12 13v9" />
    </svg>
);

const MessageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
);

// ========================================
// 🎯 Types
// ========================================
interface ProductDetailClientProps {
    product: Product;
    relatedProducts: Product[];
}

// ========================================
// 🖼️ Product Detail Client Component
// ========================================
export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
    const { addToCart } = useCart();
    const [selectedImage, setSelectedImage] = useState(0);
    const [showSizeChart, setShowSizeChart] = useState(false);
    const [show3DViewer, setShow3DViewer] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const has3DModel = Boolean(product.model_3d_url);
    const isWearable = product.category_id === 'cat_footwear' || product.category_id === 'cat_apparel';

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1">
                            <ChevronLeftIcon />
                            Back to Shop
                        </Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-400 capitalize">{product.category_id.replace('cat_', '')}</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-700 font-medium truncate">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Images / 3D Viewer */}
                    <div className="space-y-4">
                        {/* Main Image / 3D Viewer */}
                        <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-slate-100 relative">
                            {show3DViewer && has3DModel ? (
                                <ProductViewer product={product} />
                            ) : (
                                <img
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            )}

                            {/* 3D Toggle */}
                            {has3DModel && (
                                <button
                                    onClick={() => setShow3DViewer(!show3DViewer)}
                                    className={`absolute top-4 right-4 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-lg ${show3DViewer
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-slate-700 hover:bg-blue-50'
                                        }`}
                                >
                                    <CubeIcon />
                                    {show3DViewer ? 'View Photos' : 'View in 3D'}
                                </button>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {!show3DViewer && product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImage === idx
                                                ? 'border-blue-500 ring-2 ring-blue-200'
                                                : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="space-y-6">
                        {/* Category Badge */}
                        <div className="flex items-center gap-2">
                            <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-600">
                                {product.category_id.replace('cat_', '')}
                            </span>
                            {has3DModel && (
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                                    <CubeIcon />
                                    3D View
                                </span>
                            )}
                        </div>

                        {/* Title & Rating */}
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-amber-400">
                                    <StarIcon />
                                    <span className="font-semibold text-slate-900">{product.rating.toFixed(1)}</span>
                                </div>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-500">{product.reviews_count} reviews</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
                            <span className="text-slate-400 text-sm">USD</span>
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 leading-relaxed">{product.description}</p>

                        {/* Size Chart Button (for wearables) */}
                        {isWearable && (
                            <SizeChartButton
                                onClick={() => setShowSizeChart(true)}
                                categoryId={product.category_id}
                            />
                        )}

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-slate-700">Quantity:</span>
                            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 hover:bg-slate-50 transition-colors text-slate-600"
                                >
                                    −
                                </button>
                                <span className="px-4 py-2 font-medium text-slate-900 min-w-[3rem] text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-2 hover:bg-slate-50 transition-colors text-slate-600"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                            >
                                <CartIcon />
                                Add to Cart
                            </button>
                            <button className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 hover:text-red-500">
                                <HeartIcon />
                            </button>
                            <button className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 hover:text-blue-600">
                                <ShareIcon />
                            </button>
                        </div>

                        {/* Ask AI Button */}
                        <button className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors">
                            <MessageIcon />
                            Ask AI about this product
                        </button>

                        {/* Divider */}
                        <hr className="border-slate-100" />

                        {/* Specs */}
                        <ProductSpecs product={product} />
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">You May Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/product/${p.slug}`}
                                    className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all"
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={p.images[0]}
                                            alt={p.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                            {p.name}
                                        </h3>
                                        <p className="text-slate-600 font-semibold mt-1">${p.price.toFixed(2)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Size Chart Modal */}
            <SizeChartModal
                product={product}
                isOpen={showSizeChart}
                onClose={() => setShowSizeChart(false)}
            />
        </div>
    );
}
