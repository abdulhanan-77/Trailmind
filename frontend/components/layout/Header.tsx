'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import SearchBar from '@/components/header/SearchBar';
import NotificationDropdown from '@/components/header/NotificationDropdown';
import UserMenu from '@/components/header/UserMenu';

// ========================================
// 🎨 SVG Icons
// ========================================
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
);

const PackageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
        <path d="M12 22V12" />
        <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
);

// ========================================
// 🧭 Navigation Tabs
// ========================================
const navItems = [
    { icon: HomeIcon, label: 'Discover', href: '/' },
    { icon: PackageIcon, label: 'Orders', href: '/orders' },
    { icon: SettingsIcon, label: 'Settings', href: '/settings' },
];

export default function Header() {
    const pathname = usePathname();
    const { cartCount, toggleCart } = useCart();

    return (
        <header className="h-[var(--header-height)] bg-primary fixed top-0 left-0 right-0 z-30 flex items-center px-4 md:px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0" id="tour-logo">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">TM</span>
                </div>
                <div className="hidden sm:block">
                    <span className="text-lg font-bold text-white">Trail</span>
                    <span className="text-lg font-light text-blue-200 ml-0.5">mind</span>
                </div>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-white/10 p-1 rounded-full ml-8" id="tour-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-blue-100 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <Icon />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Search Bar (Desktop) */}
            <div className="hidden lg:block ml-auto mr-4" id="tour-search">
                <SearchBar variant="header" />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 ml-auto lg:ml-0">
                {/* Notifications */}
                <NotificationDropdown />

                {/* Cart */}
                <button
                    onClick={toggleCart}
                    className="p-2 text-blue-200 hover:text-white transition-colors relative"
                    id="tour-cart"
                >
                    <CartIcon />
                    {cartCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 bg-white text-primary text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {cartCount}
                        </span>
                    )}
                </button>

                {/* Divider */}
                <div className="h-6 w-px bg-blue-400/50 mx-2 hidden md:block"></div>

                {/* User Menu */}
                <UserMenu />
            </div>
        </header>
    );
}

