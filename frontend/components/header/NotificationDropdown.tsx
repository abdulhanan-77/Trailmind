'use client';

import { useState, useRef, useEffect } from 'react';

// ========================================
// 🎨 SVG Icons
// ========================================
const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
);

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const mockNotifications: Notification[] = [
    { id: '1', title: 'Order Shipped', message: 'Your order #ORD-2026-001 is on the way!', time: '2 hours ago', read: false },
    { id: '2', title: 'Price Drop', message: 'Alpine Explorer Jacket is now 20% off', time: '1 day ago', read: false },
    { id: '3', title: 'Welcome!', message: 'Thanks for joining Lumina AI', time: '3 days ago', read: true },
];

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-blue-200 hover:text-white transition-colors relative"
            >
                <BellIcon />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full border-2 border-blue-600"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                    {/* Header */}
                    <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-slate-400 text-sm">No notifications</div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${!notif.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-800 text-sm">{notif.title}</p>
                                            <p className="text-slate-500 text-xs mt-0.5 truncate">{notif.message}</p>
                                            <p className="text-slate-400 text-[10px] mt-1">{notif.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-2 border-t border-slate-100">
                        <button className="w-full text-center text-sm text-blue-600 py-2 hover:bg-slate-50 rounded-lg transition-colors">
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
