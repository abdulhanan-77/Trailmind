'use client';

// ========================================
// 📦 Orders Page
// ========================================

const PackageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
        <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
        <path d="M12 22V12" />
        <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
        <path d="m7.5 4.27 9 5.15" />
    </svg>
);

interface Order {
    id: string;
    date: string;
    status: 'processing' | 'shipped' | 'delivered';
    total: number;
    items: number;
}

const mockOrders: Order[] = [
    { id: 'ORD-2026-001', date: 'Jan 15, 2026', status: 'processing', total: 249.99, items: 1 },
    { id: 'ORD-2026-002', date: 'Jan 10, 2026', status: 'shipped', total: 169.98, items: 2 },
    { id: 'ORD-2025-089', date: 'Dec 24, 2025', status: 'delivered', total: 89.99, items: 1 },
];

const statusColors = {
    processing: 'bg-amber-50 text-amber-600 border-amber-200',
    shipped: 'bg-blue-50 text-blue-600 border-blue-200',
    delivered: 'bg-green-50 text-green-600 border-green-200',
};

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
                <p className="text-slate-500 mt-1">Track and manage your purchases.</p>
            </div>

            {mockOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                    <PackageIcon />
                    <h3 className="text-lg font-semibold text-slate-700 mt-4">No orders yet</h3>
                    <p className="text-slate-400 mt-1">Your order history will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {mockOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-lg hover:shadow-slate-100 transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                                    <PackageIcon />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">{order.id}</p>
                                    <p className="text-sm text-slate-400">{order.date} · {order.items} item{order.items > 1 ? 's' : ''}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <span className={`text-xs font-medium px-3 py-1 rounded-full border ${statusColors[order.status]}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                                <span className="font-bold text-slate-800">${order.total.toFixed(2)}</span>
                                <button className="text-sm font-medium text-blue-600 hover:underline">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
