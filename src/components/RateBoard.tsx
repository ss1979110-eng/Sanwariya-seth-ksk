import React, { useState } from 'react';
import { 
  Sprout, 
  ShieldAlert, 
  Wheat, 
  Wrench, 
  Search, 
  Tag, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { Product, ProductCategory, AdminSettings } from '../types';
import { CATEGORIES } from '../data/initialData';

interface RateBoardProps {
  products: Product[];
  settings: AdminSettings;
  isAdmin: boolean;
  onEditProductRate?: (product: Product) => void;
  onAddNewProduct?: () => void;
  onQuickSaleSelect?: (product: Product) => void;
}

export const RateBoard: React.FC<RateBoardProps> = ({
  products,
  settings,
  isAdmin,
  onEditProductRate,
  onAddNewProduct,
  onQuickSaleSelect,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getCategoryIcon = (catId: ProductCategory) => {
    switch (catId) {
      case 'fertilizers':
        return <Sprout className="w-5 h-5 text-emerald-600" />;
      case 'pesticides':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'seeds':
        return <Wheat className="w-5 h-5 text-amber-600" />;
      default:
        return <Wrench className="w-5 h-5 text-blue-600" />;
    }
  };

  const filteredProducts = products.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query || 
      item.name.toLowerCase().includes(query) ||
      (item.brand && item.brand.toLowerCase().includes(query)) ||
      (item.chemicalFormula && item.chemicalFormula.toLowerCase().includes(query));
    return matchesCat && matchesSearch;
  });

  // Calculate totals per category
  const countByCategory = (cat: ProductCategory) => 
    products.filter(p => p.category === cat).length;

  return (
    <div className="space-y-6">
      
      {/* Banner / Title Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-emerald-300 font-semibold text-xs tracking-wider uppercase mb-1">
              <Tag className="w-4 h-4" />
              <span>Official Shop Rate List • आज की दर सूची</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Product Rates & Inventory
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Real-time daily rates for Fertilizers, Pesticides, and Certified Hybrid Seeds. All rates are inclusive of applicable taxes.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            {isAdmin && onAddNewProduct && (
              <button
                onClick={onAddNewProduct}
                className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product & Rate</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Shortcut Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-700/50">
          {CATEGORIES.map((cat) => {
            const count = countByCategory(cat.id);
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-400 text-white ring-2 ring-emerald-400/30'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 bg-slate-900/80 rounded-lg">
                    {getCategoryIcon(cat.id)}
                  </div>
                  <div>
                    <span className="text-xs font-bold block leading-tight">{cat.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{count} items</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-sm">
        {/* Category Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Products ({products.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.name.split(' ')[0]} ({countByCategory(cat.id)})
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fertilizer, seed name, brand..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Main Grid of Products & Rates */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No products found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or filter selection. As Admin, you can add new items anytime.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const isLowStock = product.stock <= product.minStockAlert;
            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
              >
                <div>
                  {/* Top Header Row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
                        {getCategoryIcon(product.category)}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          {product.brand || 'Standard Agri'}
                        </span>
                        <h3 className="font-bold text-slate-100 text-sm leading-snug group-hover:text-emerald-400 transition-colors">
                          {product.name}
                        </h3>
                      </div>
                    </div>

                    {/* Admin Edit Rate Action */}
                    {isAdmin && onEditProductRate && (
                      <button
                        onClick={() => onEditProductRate(product)}
                        className="p-1.5 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 rounded-lg transition-colors"
                        title="Edit Product Rate & Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Chemical Formula / Spec Tag */}
                  {product.chemicalFormula && (
                    <div className="mb-3">
                      <span className="inline-block bg-slate-800/80 text-emerald-300 text-[11px] font-mono px-2.5 py-0.5 rounded-md border border-slate-700/80">
                        {product.chemicalFormula}
                      </span>
                    </div>
                  )}

                  {product.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Price & Stock Footer Box */}
                <div className="pt-3 border-t border-slate-800/80 mt-2 space-y-3">
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
                        Selling Rate (मूल्य)
                      </span>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-xl font-extrabold text-emerald-400">
                          {settings.currencySymbol}{product.rate.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          / {product.unit}
                        </span>
                      </div>
                      {product.mrp && product.mrp > product.rate && (
                        <div className="text-[11px] text-slate-500 space-x-1">
                          <span className="line-through">{settings.currencySymbol}{product.mrp}</span>
                          <span className="text-emerald-400 font-bold">
                            Save {settings.currencySymbol}{product.mrp - product.rate}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Stock Status Badge */}
                    <div className="text-right">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-md">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Out of Stock</span>
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{product.stock} Left</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Stock: {product.stock}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Sale Action Button */}
                  {onQuickSaleSelect && (
                    <button
                      onClick={() => onQuickSaleSelect(product)}
                      disabled={isOutOfStock}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                        isOutOfStock
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                      }`}
                    >
                      <span>Record Sale for Item</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
