'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';

// ========================================
// 🎨 SVG Icons
// ========================================
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const LoadingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

const CubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21 16-9 5-9-5V8l9-5 9 5z" /><path d="m3 8 9 5 9-5" /><path d="M12 13v9" />
    </svg>
);

// ========================================
// 🎯 Types
// ========================================
interface SearchBarProps {
    variant?: 'header' | 'mobile';
}

// ========================================
// 🔍 Search Bar Component
// ========================================
export default function SearchBar({ variant = 'header' }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Debounced search function
    const searchProducts = useCallback(async (searchQuery: string) => {
        if (searchQuery.trim().length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(
                `${API_BASE_URL}/products?search=${encodeURIComponent(searchQuery)}`,
                { cache: 'no-store' }
            );
            if (res.ok) {
                const data: Product[] = await res.json();
                setResults(data.slice(0, 8)); // Limit to 8 results
                setIsOpen(data.length > 0);
            }
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Handle input change with debounce
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (query.trim().length >= 2) {
            debounceRef.current = setTimeout(() => {
                searchProducts(query);
            }, 300);
        } else {
            setResults([]);
            setIsOpen(false);
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query, searchProducts]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle product selection
    const handleSelect = (product: Product) => {
        setQuery('');
        setIsOpen(false);
        router.push(`/product/${product.slug}`);
    };

    // Handle Enter key for search
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && results.length > 0) {
            handleSelect(results[0]);
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <div className={`flex items-center rounded-full px-4 py-2 transition-all ${variant === 'header'
                ? 'search-bar-header w-64'
                : 'bg-slate-100 w-full focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-200'
                }`}>
                {isLoading ? <LoadingIcon /> : <SearchIcon />}
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className={`bg-transparent border-none outline-none text-sm w-full ml-2 ${variant === 'header'
                        ? 'text-white placeholder-blue-100'
                        : 'text-slate-700 placeholder-slate-400'
                        }`}
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setIsOpen(false); setResults([]); }}
                        className={variant === 'header' ? 'text-blue-200 hover:text-white' : 'text-slate-400 hover:text-slate-600'}
                    >
                        <CloseIcon />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                    <div className="py-2">
                        {results.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => handleSelect(product)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                            >
                                {/* Product Image */}
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                    {product.images?.[0] ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
                                            No img
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-slate-800 text-sm truncate">{product.name}</p>
                                        {product.model_3d_url && (
                                            <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-0.5">
                                                <CubeIcon />
                                                3D
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 capitalize">
                                        {product.category_id.replace('cat_', '')}
                                    </p>
                                </div>

                                {/* Price */}
                                <span className="font-semibold text-blue-600 text-sm">
                                    ${product.price.toFixed(2)}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* View All Results */}
                    {results.length >= 8 && (
                        <div className="border-t border-slate-100 p-2">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    // Could navigate to a search results page
                                }}
                                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-2 font-medium"
                            >
                                View all results
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* No Results */}
            {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-50">
                    <p className="text-sm text-slate-400 text-center">No products found for "{query}"</p>
                </div>
            )}
        </div>
    );
}
