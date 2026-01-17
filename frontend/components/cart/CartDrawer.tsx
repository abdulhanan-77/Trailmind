'use client';

import { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
import { useCart } from '@/context/CartContext';

// ========================================
// 🎨 SVG Icons
// ========================================
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
);

const LoadingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const StripeIcon = () => (
    <svg width="32" height="14" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M60 12.5C60 8.08 57.52 4.47 53.07 4.47C48.6 4.47 45.66 8.08 45.66 12.47C45.66 17.66 49.15 20.53 53.91 20.53C56.24 20.53 58 20 59.26 19.27V15.87C58 16.53 56.52 16.93 54.66 16.93C52.83 16.93 51.21 16.27 50.98 14.07H59.96C59.96 13.8 60 12.93 60 12.5ZM50.92 11.07C50.92 8.97 52.21 8 53.05 8C53.86 8 55.07 8.97 55.07 11.07H50.92Z" fill="#6772E5" />
        <path fillRule="evenodd" clipRule="evenodd" d="M39.59 4.47C37.74 4.47 36.55 5.33 35.89 5.93L35.67 4.73H31.07V24.87L35.93 23.83L35.95 19.33C36.63 19.83 37.61 20.53 39.57 20.53C43.41 20.53 46.89 17.4 46.89 12.27C46.87 7.6 43.35 4.47 39.59 4.47ZM38.48 16.87C37.19 16.87 36.41 16.4 35.95 15.83L35.93 9.33C36.43 8.7 37.23 8.27 38.48 8.27C40.52 8.27 41.93 10.53 41.93 12.55C41.93 14.63 40.54 16.87 38.48 16.87Z" fill="#6772E5" />
        <path fillRule="evenodd" clipRule="evenodd" d="M26.69 3.6L31.57 2.55V-0.95L26.69 0.08V3.6Z" fill="#6772E5" />
        <path d="M31.57 4.73H26.69V20.27H31.57V4.73Z" fill="#6772E5" />
        <path fillRule="evenodd" clipRule="evenodd" d="M22.26 5.97L21.98 4.73H17.45V20.27H22.31V9.63C23.45 8.13 25.39 8.4 26.01 8.63V4.73C25.37 4.47 23.39 4.1 22.26 5.97Z" fill="#6772E5" />
        <path fillRule="evenodd" clipRule="evenodd" d="M12.37 1.65L7.62 2.68L7.6 16.17C7.6 18.67 9.46 20.53 11.96 20.53C13.35 20.53 14.37 20.27 14.93 19.97V16.47C14.39 16.67 12.35 17.27 12.35 14.77V8.5H14.93V4.73H12.35L12.37 1.65Z" fill="#6772E5" />
        <path fillRule="evenodd" clipRule="evenodd" d="M2.60999 9.33C2.60999 8.63 3.16999 8.33 4.08999 8.33C5.37999 8.33 6.99999 8.73 8.28999 9.47V4.93C6.87999 4.37 5.48999 4.13 4.08999 4.13C1.62999 4.13 -0.11001 5.57 -0.11001 7.97C-0.11001 11.73 5.07999 11.13 5.07999 12.77C5.07999 13.6 4.39999 13.9 3.41999 13.9C2.00999 13.9 0.21999 13.33 -0.21001 13.13V17.77C1.33999 18.43 2.90999 18.73 3.41999 18.73C5.93999 18.73 7.79999 17.23 7.79999 14.8C7.77999 10.73 2.60999 11.47 2.60999 9.33Z" fill="#6772E5" />
    </svg>
);

// ========================================
// 🛒 Cart Drawer Component
// ========================================
export default function CartDrawer() {
    const { items, isCartOpen, toggleCart, removeFromCart, clearCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        if (items.length === 0) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/checkout/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.images?.[0] || null,
                    })),
                    success_url: `${window.location.origin}/checkout?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${window.location.origin}/checkout?canceled=true`,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Checkout failed');
            }

            const { checkout_url } = await response.json();

            // Clear cart before redirect
            clearCart();

            // Redirect to Stripe Checkout
            window.location.href = checkout_url;

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Checkout failed');
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    onClick={toggleCart}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-800">Shopping Cart ({items.length})</h2>
                    <button onClick={toggleCart} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                        <CloseIcon />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-400">Your cart is empty</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3 bg-slate-50 rounded-xl">
                                {/* Image */}
                                <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                    {item.images && item.images.length > 0 ? (
                                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">No img</div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-800 truncate">{item.name}</p>
                                    <p className="text-sm text-slate-500">${item.price.toFixed(2)}</p>

                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-sm text-slate-600">Qty: {item.quantity}</span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="ml-auto p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-4 border-t border-slate-100 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Subtotal</span>
                            <span className="text-xl font-bold text-slate-900">${total.toFixed(2)}</span>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingIcon />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <LockIcon />
                                    Secure Checkout
                                </>
                            )}
                        </button>

                        {/* Stripe Badge */}
                        <div className="flex items-center justify-center gap-2 pt-2">
                            <span className="text-xs text-slate-400">Powered by</span>
                            <StripeIcon />
                        </div>

                        <button
                            onClick={clearCart}
                            className="w-full text-slate-500 text-sm hover:text-red-500 transition-colors"
                        >
                            Clear Cart
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
