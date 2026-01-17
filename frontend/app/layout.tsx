import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { Providers } from "@/components/Providers";
import ChatOverlay from "@/components/chat/ChatOverlay";
import CartDrawer from "@/components/cart/CartDrawer";
import OnboardingTour from "@/components/OnboardingTour";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata = {
  title: "Trailmind - AI-Powered Outdoor Gear",
  description: "Discover premium outdoor equipment curated by AI for your next adventure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Providers>
          <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="pt-20 min-h-screen transition-all">
              <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
                {children}
              </div>
            </main>
            {/* Onboarding Tour */}
            <OnboardingTour />
            {/* Floating Chat Button + Overlay */}
            <ChatOverlay />
            {/* Cart Drawer */}
            <CartDrawer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

