'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ProductViewer from './ProductViewer';
import { Product } from '@/types';
import { AGENT_COMMAND_EVENT, AgentCommand, dispatchAgentCommand } from '@/types/agent-commands';

// ========================================
// 🎨 Icons
// ========================================
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const CubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21 16-9 5-9-5V8l9-5 9 5z" />
        <path d="m3 8 9 5 9-5" />
        <path d="M12 13v9" />
    </svg>
);

const RotateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.84 6.72 2.25" />
        <path d="M21 3v6h-6" />
    </svg>
);

// ========================================
// 🎯 Types
// ========================================
interface ProductDetailModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

// ========================================
// 📐 Dimension Display
// ========================================
function DimensionBadge({ label, value, unit }: { label: string; value?: number; unit: string }) {
    if (!value) return null;
    return (
        <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
            <span className="text-xs text-slate-500 uppercase tracking-wide">{label}</span>
            <span className="text-lg font-semibold text-slate-800">{value}</span>
            <span className="text-xs text-slate-400">{unit}</span>
        </div>
    );
}

// ========================================
// 🎮 Quick View Controls
// ========================================
const QUICK_VIEWS = [
    { label: 'Front', coords: { x: 0, y: 0, z: 0 } },
    { label: 'Back', coords: { x: 0, y: 180, z: 0 } },
    { label: 'Left', coords: { x: 0, y: -90, z: 0 } },
    { label: 'Right', coords: { x: 0, y: 90, z: 0 } },
    { label: 'Top', coords: { x: 90, y: 0, z: 0 } },
    { label: 'Bottom', coords: { x: -90, y: 0, z: 0 } },
];

// ========================================
// 🖼️ Main Modal Component
// ========================================
export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [activeView, setActiveView] = useState('Front');
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Handle quick view rotation
    const handleQuickView = useCallback((label: string, coords: { x: number; y: number; z: number }) => {
        setActiveView(label);
        dispatchAgentCommand({
            action: 'ROTATE_MODEL',
            coordinates: coords,
            message: `Rotating to ${label} view`
        });
    }, []);

    // Reset view
    const handleReset = useCallback(() => {
        setActiveView('Front');
        dispatchAgentCommand({ action: 'RESET_VIEW' });
    }, []);

    if (!isOpen) return null;

    const has3DModel = Boolean(product.model_3d_url);
    const spatial = product.spatial_metadata;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-title"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-105"
                    aria-label="Close modal"
                >
                    <CloseIcon />
                </button>

                {/* 3D Viewer Section */}
                <div className="relative flex-1 min-h-[400px] lg:min-h-0 bg-gradient-to-br from-slate-100 to-slate-200">
                    {has3DModel ? (
                        <>
                            <ProductViewer
                                modelUrl={product.model_3d_url!}
                                productName={product.name}
                                autoRotate={false}
                                enableZoom={true}
                                onLoadComplete={() => setIsLoading(false)}
                                className="w-full h-full"
                            />

                            {/* Quick View Buttons */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                                {QUICK_VIEWS.map(({ label, coords }) => (
                                    <button
                                        key={label}
                                        onClick={() => handleQuickView(label, coords)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${activeView === label
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                                <button
                                    onClick={handleReset}
                                    className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full transition-all"
                                    aria-label="Reset view"
                                >
                                    <RotateIcon />
                                </button>
                            </div>
                        </>
                    ) : (
                        /* Fallback for products without 3D model */
                        <div className="w-full h-full flex items-center justify-center">
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    )}

                    {/* 3D Badge */}
                    {has3DModel && (
                        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-full">
                            <CubeIcon />
                            3D View
                        </div>
                    )}
                </div>

                {/* Product Info Section */}
                <div className="w-full lg:w-[380px] p-6 overflow-y-auto">
                    {/* Title & Price */}
                    <h2 id="product-title" className="text-2xl font-bold text-slate-800 mb-2">
                        {product.name}
                    </h2>
                    <p className="text-3xl font-bold text-blue-600 mb-4">
                        ${product.price.toFixed(2)}
                    </p>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        {product.description}
                    </p>

                    {/* Spatial Metadata (Dimensions) */}
                    {spatial && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <CubeIcon />
                                Dimensions
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                <DimensionBadge label="Width" value={spatial.width_cm} unit="cm" />
                                <DimensionBadge label="Height" value={spatial.height_cm} unit="cm" />
                                <DimensionBadge label="Depth" value={spatial.depth_cm} unit="cm" />
                            </div>
                            {spatial.weight_kg && (
                                <p className="mt-2 text-sm text-slate-500">
                                    Weight: <span className="font-medium">{spatial.weight_kg} kg</span>
                                </p>
                            )}
                            {spatial.materials && spatial.materials.length > 0 && (
                                <p className="mt-2 text-sm text-slate-500">
                                    Materials: <span className="font-medium">{spatial.materials.join(', ')}</span>
                                </p>
                            )}
                        </div>
                    )}

                    {/* Features */}
                    {product.features.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-800 mb-2">Features</h3>
                            <ul className="space-y-1.5">
                                {product.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Add to Cart Button */}
                    <button className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition-colors">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
