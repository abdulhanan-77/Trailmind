'use client';

import { useEffect, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// ========================================
// 🎨 Icons
// ========================================
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" /><path d="m9 9 6 6" />
    </svg>
);

const PackageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
        <path d="M12 22V12" />
        <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
    </svg>
);

// ========================================
// 📄 Checkout Success/Cancel Page
// ========================================
export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const canceled = searchParams.get('canceled');

    const [sessionData, setSessionData] = useState<{
        status: string;
        payment_status: string;
        customer_email: string | null;
        amount_total: number;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (sessionId) {
            setLoading(true);
            fetch(`${API_BASE_URL}/checkout/session/${sessionId}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch session');
                    return res.json();
                })
                .then(data => {
                    setSessionData(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [sessionId]);

    // Canceled checkout
    if (canceled) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center max-w-md">
                    <XCircleIcon />
                    <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-2">
                        Checkout Canceled
                    </h1>
                    <p className="text-slate-500 mb-6">
                        Your order was not completed. Your cart items are still saved.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    // Success with session
    if (sessionId) {
        if (loading) {
            return (
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
                        <p className="text-slate-500 mt-4">Loading order details...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center max-w-md">
                        <XCircleIcon />
                        <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-2">
                            Error Loading Order
                        </h1>
                        <p className="text-slate-500 mb-6">{error}</p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                        >
                            Return Home
                        </Link>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="mx-auto mb-6">
                        <CheckCircleIcon />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        Order Confirmed! 🎉
                    </h1>
                    <p className="text-slate-500 mb-6">
                        Thank you for your purchase. We'll send a confirmation email to{' '}
                        <span className="font-medium text-slate-700">
                            {sessionData?.customer_email || 'your email'}
                        </span>
                    </p>

                    {sessionData && (
                        <div className="bg-slate-50 rounded-xl p-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">Order Total</span>
                                <span className="text-xl font-bold text-slate-900">
                                    ${sessionData.amount_total.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-slate-500">Payment Status</span>
                                <span className="text-green-600 font-medium capitalize">
                                    {sessionData.payment_status}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 justify-center">
                        <Link
                            href="/orders"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                        >
                            <PackageIcon />
                            View Orders
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Default: no session or canceled
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center max-w-md">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Checkout</h1>
                <p className="text-slate-500 mb-6">
                    Please add items to your cart to proceed with checkout.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                    Browse Products
                </Link>
            </div>
        </div>
    );
}
