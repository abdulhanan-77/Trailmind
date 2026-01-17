'use client';

import { CartProvider } from "@/context/CartContext";
import { UIProvider } from "@/context/UIContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <UIProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </UIProvider>
    );
}
