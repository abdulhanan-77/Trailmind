'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, MessageSquare, Settings, LogOut } from 'lucide-react';

const menuItems = [
    { icon: Home, label: 'Discover', href: '/' },
    { icon: ShoppingBag, label: 'My Orders', href: '/orders' },
    { icon: MessageSquare, label: 'Concierge', href: '/chat' }, // Dedicated chat page approach or overlay toggle?
    { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex flex-col z-20 hidden md:flex">
            <div className="p-6 border-b border-gray-50">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Lumina AI
                </h1>
                <p className="text-xs text-gray-400 mt-1">Autonomous Shopping</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-50">
                <button className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 w-full transition-colors rounded-xl hover:bg-red-50">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
