'use client';

import { Product } from '@/types';

// ========================================
// 🎨 Icons
// ========================================
const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

// ========================================
// 🎯 Types
// ========================================
interface ProductSpecsProps {
    product: Product;
}

interface SpecItem {
    label: string;
    value: string;
}

// ========================================
// 📊 Category-Specific Specs
// ========================================
function getTechSpecs(product: Product): SpecItem[] {
    // Extract meaningful specs from features or use defaults
    const specs: SpecItem[] = [
        { label: 'Brand', value: 'Trailmind Gear' },
        { label: 'Warranty', value: '2 Years' },
        { label: 'SKU', value: product.id.toUpperCase() },
    ];

    // Add spatial metadata if available
    if (product.spatial_metadata) {
        if (product.spatial_metadata.weight_kg) {
            specs.push({ label: 'Weight', value: `${product.spatial_metadata.weight_kg} kg` });
        }
        if (product.spatial_metadata.width_cm && product.spatial_metadata.height_cm) {
            specs.push({
                label: 'Dimensions',
                value: `${product.spatial_metadata.width_cm} × ${product.spatial_metadata.height_cm} × ${product.spatial_metadata.depth_cm || 0} cm`
            });
        }
        if (product.spatial_metadata.materials?.length) {
            specs.push({ label: 'Materials', value: product.spatial_metadata.materials.join(', ') });
        }
    }

    return specs;
}

function getOutdoorSpecs(product: Product): SpecItem[] {
    const specs: SpecItem[] = [
        { label: 'Brand', value: 'Trailmind Gear' },
        { label: 'Warranty', value: 'Lifetime' },
        { label: 'SKU', value: product.id.toUpperCase() },
        { label: 'Origin', value: 'Designed in USA' },
    ];

    if (product.spatial_metadata?.weight_kg) {
        specs.push({ label: 'Weight', value: `${product.spatial_metadata.weight_kg} kg` });
    }

    return specs;
}

// ========================================
// 📋 Product Specifications Component
// ========================================
export default function ProductSpecs({ product }: ProductSpecsProps) {
    const isTech = product.category_id === 'cat_tech';
    const isOutdoor = product.category_id === 'cat_outdoor';

    const specs = isTech ? getTechSpecs(product) : isOutdoor ? getOutdoorSpecs(product) : [];

    return (
        <div className="space-y-6">
            {/* Features Section */}
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckIcon />
                    Key Features
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Specifications Table */}
            {specs.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <InfoIcon />
                        Specifications
                    </h3>
                    <div className="bg-slate-50 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <tbody>
                                {specs.map((spec, idx) => (
                                    <tr key={spec.label} className={idx % 2 === 0 ? '' : 'bg-white'}>
                                        <td className="px-4 py-3 text-slate-500 font-medium w-1/3">{spec.label}</td>
                                        <td className="px-4 py-3 text-slate-800">{spec.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                <span className="text-slate-600">
                    {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                </span>
            </div>
        </div>
    );
}
