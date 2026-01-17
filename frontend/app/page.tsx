import Link from 'next/link';
import ProductGrid from '@/components/product/ProductGrid';
import { fetchProducts, fetchCategories } from '@/lib/api';

// ========================================
// 🎨 SVG Icons
// ========================================
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
    <path d="M4 17v2" />
    <path d="M5 18H3" />
  </svg>
);

export default async function Home(props: { searchParams: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams;
  const categoryFilter = searchParams.category;
  const products = await fetchProducts(categoryFilter);
  const categories = await fetchCategories();

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden h-72 md:h-96 w-full bg-slate-900 text-white flex items-center">
        {/* ... (hero content same) */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800/90 to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />

        <div className="relative z-20 px-8 md:px-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-400/30 backdrop-blur-sm text-blue-300 px-3 py-1.5 rounded-full text-xs font-medium mb-4">
            {/* ... */}
            <SparklesIcon />
            AI-Powered Discovery
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Adventure Awaits.<br />Gear Up.
          </h1>
          <p className="text-slate-300 mb-6 max-w-md text-sm md:text-base">
            Discover premium equipment curated by AI for your next expedition.
          </p>
          <button className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-full font-semibold text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-lg hover:shadow-xl">
            Shop Now
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!categoryFilter ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/?category=${cat.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${categoryFilter === cat.slug ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Section Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {categoryFilter ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}` : 'New Arrivals'}
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            {products.length} products found
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 cursor-pointer">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid products={products} />
    </div>
  );
}
