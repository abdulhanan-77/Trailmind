'use client';

import { useState } from 'react';
import { Product } from '@/types';

// ========================================
// 📏 Size Chart Data by Category
// ========================================
const FOOTWEAR_SIZES = [
    { us: '6', uk: '5.5', eu: '38.5', cm: '24' },
    { us: '7', uk: '6', eu: '40', cm: '25' },
    { us: '8', uk: '7', eu: '41', cm: '26' },
    { us: '9', uk: '8', eu: '42', cm: '27' },
    { us: '10', uk: '9', eu: '43', cm: '28' },
    { us: '11', uk: '10', eu: '44', cm: '29' },
    { us: '12', uk: '11', eu: '45', cm: '30' },
];

const APPAREL_SIZES = [
    { size: 'XS', chest: '32-34"', waist: '26-28"', hips: '34-36"' },
    { size: 'S', chest: '35-37"', waist: '29-31"', hips: '37-39"' },
    { size: 'M', chest: '38-40"', waist: '32-34"', hips: '40-42"' },
    { size: 'L', chest: '41-43"', waist: '35-37"', hips: '43-45"' },
    { size: 'XL', chest: '44-46"', waist: '38-40"', hips: '46-48"' },
    { size: '2XL', chest: '47-49"', waist: '41-43"', hips: '49-51"' },
];

// ========================================
// 🎨 Icons
// ========================================
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);

const RulerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
        <path d="m14.5 12.5 2-2" /><path d="m11.5 9.5 2-2" /><path d="m8.5 6.5 2-2" /><path d="m17.5 15.5 2-2" />
    </svg>
);

// ========================================
// 🎯 Types
// ========================================
interface SizeChartProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

interface SizeChartButtonProps {
    onClick: () => void;
    categoryId: string;
}

// ========================================
// 📐 Size Chart Modal
// ========================================
export function SizeChartModal({ product, isOpen, onClose }: SizeChartProps) {
    if (!isOpen) return null;

    const isFootwear = product.category_id === 'cat_footwear';
    const isApparel = product.category_id === 'cat_apparel';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <RulerIcon />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Size Guide</h2>
                            <p className="text-sm text-slate-500">{product.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto max-h-[60vh]">
                    {isFootwear && (
                        <div>
                            <p className="text-sm text-slate-600 mb-4">
                                Find your perfect fit. If you're between sizes, we recommend sizing up for comfort.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700 rounded-tl-lg">US</th>
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700">UK</th>
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700">EU</th>
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700 rounded-tr-lg">CM</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {FOOTWEAR_SIZES.map((size, idx) => (
                                            <tr key={size.us} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                                <td className="px-4 py-3 text-slate-800 font-medium">{size.us}</td>
                                                <td className="px-4 py-3 text-slate-600">{size.uk}</td>
                                                <td className="px-4 py-3 text-slate-600">{size.eu}</td>
                                                <td className="px-4 py-3 text-slate-600">{size.cm}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {isApparel && (
                        <div>
                            <p className="text-sm text-slate-600 mb-4">
                                Measurements are in inches. For the best fit, compare to a similar garment you already own.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700 rounded-tl-lg">Size</th>
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Chest</th>
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Waist</th>
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700 rounded-tr-lg">Hips</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {APPAREL_SIZES.map((size, idx) => (
                                            <tr key={size.size} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                                <td className="px-4 py-3 text-slate-800 font-medium">{size.size}</td>
                                                <td className="px-4 py-3 text-slate-600">{size.chest}</td>
                                                <td className="px-4 py-3 text-slate-600">{size.waist}</td>
                                                <td className="px-4 py-3 text-slate-600">{size.hips}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {!isFootwear && !isApparel && (
                        <div className="text-center py-8">
                            <p className="text-slate-500">Size chart not available for this category.</p>
                        </div>
                    )}

                    {/* Measurement Tips */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                        <h3 className="font-medium text-blue-900 mb-2">Measurement Tips</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            {isFootwear ? (
                                <>
                                    <li>• Measure your feet at the end of the day when they're largest</li>
                                    <li>• Stand while measuring for accuracy</li>
                                    <li>• Consider wearing the socks you'll use with the product</li>
                                </>
                            ) : (
                                <>
                                    <li>• Measure over undergarments, not over clothing</li>
                                    <li>• Keep the tape measure snug but not tight</li>
                                    <li>• Stand naturally while being measured</li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ========================================
// 🔘 Size Chart Button
// ========================================
export function SizeChartButton({ onClick, categoryId }: SizeChartButtonProps) {
    const isWearable = categoryId === 'cat_footwear' || categoryId === 'cat_apparel';

    if (!isWearable) return null;

    return (
        <button
            onClick={onClick}
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
            <RulerIcon />
            Size Guide
        </button>
    );
}

export default SizeChartModal;
