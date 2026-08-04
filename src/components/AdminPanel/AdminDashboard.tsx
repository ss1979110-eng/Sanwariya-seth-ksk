import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Sprout, 
  ShieldAlert, 
  Wheat, 
  Wrench, 
  Tag, 
  Receipt, 
  Settings, 
  KeyRound, 
  RotateCcw, 
  Check, 
  AlertTriangle,
  Layers,
  Calendar,
  Save
} from 'lucide-react';
import { Product, SaleTransaction, AdminSettings, ProductCategory } from '../../types';
import { CATEGORIES } from '../../data/initialData';

interface AdminDashboardProps {
  products: Product[];
  transactions: SaleTransaction[];
  settings: AdminSettings;
  onUpdateProduct: (product: Product) => void;
  onSaveProductDirectly: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onOpenAddProductModal: () => void;
  onUpdateTransaction: (transaction: SaleTransaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
  onOpenEditSaleModal: (transaction: SaleTransaction) => void;
  onSaveSettings: (settings: AdminSettings) => void;
  onResetData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  transactions,
  settings,
  onUpdateProduct,
  onSaveProductDirectly,
  onDeleteProduct,
  onOpenAddProductModal,
  onUpdateTransaction,
  onDeleteTransaction,
  onOpenEditSaleModal,
  onSaveSettings,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'sales' | 'settings'>('products');
  
  // Products Tab States
  const [prodSearch, setProdSearch] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory | 'all'>('all');
  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [inlineRateValue, setInlineRateValue] = useState<number>(0);

  // Sales Tab States
  const [salesSearch, setSalesSearch] = useState('');
  const [salesCategoryFilter, setSalesCategoryFilter] = useState<ProductCategory | 'all'>('all');

  // Settings Form States
  const [shopName, setShopName] = useState(settings.shopName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [adminPin, setAdminPin] = useState(settings.adminPin);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Keep form fields synced when settings prop updates from Firestore
  useEffect(() => {
    if (settings) {
      setShopName(settings.shopName || '');
      setTagline(settings.tagline || '');
      setPhone(settings.phone || '');
      setAddress(settings.address || '');
      setCurrencySymbol(settings.currencySymbol || '₹');
      setAdminPin(settings.adminPin || '1234');
    }
  }, [settings]);

  // Category statistics
  const getCatStats = (catId: ProductCategory) => {
    const catProds = products.filter(p => p.category === catId);
    const totalVal = catProds.reduce((sum, p) => sum + (p.rate * p.stock), 0);
    const lowStock = catProds.filter(p => p.stock <= p.minStockAlert).length;
    return { count: catProds.length, totalVal, lowStock };
  };

  // Products filtering
  const filteredProducts = products.filter(p => {
    const matchCat = prodCategory === 'all' || p.category === prodCategory;
    const query = prodSearch.toLowerCase().trim();
    const matchSearch = !query || p.name.toLowerCase().includes(query) || (p.brand && p.brand.toLowerCase().includes(query));
    return matchCat && matchSearch;
  });

  // Inline rate quick save
  const handleInlineRateSave = (product: Product) => {
    onSaveProductDirectly({
      ...product,
      rate: inlineRateValue,
      updatedAt: new Date().toISOString(),
    });
    setEditingRateId(null);
  };

  // Sales filtering
  const filteredSales = transactions.filter(t => {
    const query = salesSearch.toLowerCase().trim();
    const matchSearch = 
      !query || 
      t.billNumber.toLowerCase().includes(query) || 
      (t.customerName && t.customerName.toLowerCase().includes(query));

    const matchCat = 
      salesCategoryFilter === 'all' || 
      t.items.some(i => i.category === salesCategoryFilter);

    return matchSearch && matchCat;
  });

  const handleSettingsFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      adminPin,
      shopName,
      tagline,
      phone,
      address,
      currencySymbol,
      lowStockThreshold: settings.lowStockThreshold,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Panel Header Banner */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticated Owner Portal • एडमिन पैनल</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100">AgriShop Admin Controls</h2>
          <p className="text-xs text-slate-300 mt-1">
            Add/edit product rates, customize categories, modify past sales records, and configure security PIN.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700/80 flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'products' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Products & Rates</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'categories' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Category View</span>
          </button>

          <button
            onClick={() => setActiveTab('sales')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'sales' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Sales Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'settings' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Shop Settings</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PRODUCTS & RATES MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setProdCategory('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  prodCategory === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                All ({products.length})
              </button>
              <button
                onClick={() => setProdCategory('fertilizers')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  prodCategory === 'fertilizers' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Fertilizers
              </button>
              <button
                onClick={() => setProdCategory('pesticides')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  prodCategory === 'pesticides' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Pesticides
              </button>
              <button
                onClick={() => setProdCategory('seeds')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  prodCategory === 'seeds' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Seeds
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative w-full sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={prodSearch}
                  onChange={(e) => setProdSearch(e.target.value)}
                  placeholder="Filter products..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-2 py-1 text-xs text-slate-100"
                />
              </div>

              <button
                onClick={onOpenAddProductModal}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Products Admin Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Product Name & Category</th>
                    <th className="py-3 px-4">Brand / Spec</th>
                    <th className="py-3 px-4">Selling Rate</th>
                    <th className="py-3 px-4">Unit / MRP</th>
                    <th className="py-3 px-4">Stock Level</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-100">
                        <div>{p.name}</div>
                        <span className="text-[10px] text-emerald-400 font-mono uppercase">{p.category}</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-200">{p.brand || '—'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.chemicalFormula || ''}</div>
                      </td>

                      {/* Selling Rate Column with Quick Inline Edit */}
                      <td className="py-3 px-4">
                        {editingRateId === p.id ? (
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              value={inlineRateValue}
                              onChange={(e) => setInlineRateValue(Number(e.target.value))}
                              className="w-20 bg-slate-950 border border-emerald-500 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded text-xs"
                            />
                            <button
                              onClick={() => handleInlineRateSave(p)}
                              className="p-1 bg-emerald-500 text-slate-950 rounded hover:bg-emerald-400"
                              title="Save Rate"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1.5">
                            <span className="text-sm font-extrabold text-emerald-400">
                              {settings.currencySymbol}{p.rate}
                            </span>
                            <button
                              onClick={() => {
                                setEditingRateId(p.id);
                                setInlineRateValue(p.rate);
                              }}
                              className="text-slate-500 hover:text-amber-400 p-0.5"
                              title="Quick Change Rate"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div>{p.unit}</div>
                        {p.mrp && <div className="text-[10px] text-slate-500">MRP: {settings.currencySymbol}{p.mrp}</div>}
                      </td>

                      <td className="py-3 px-4 font-bold">
                        {p.stock <= p.minStockAlert ? (
                          <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 text-[10px]">
                            ⚠️ {p.stock} (Low)
                          </span>
                        ) : (
                          <span className="text-emerald-400">{p.stock} units</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => onUpdateProduct(p)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete product "${p.name}"?`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 rounded text-[11px] font-bold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: SEPARATE CATEGORY OVERVIEW (Fertilizers, Pesticides, Seeds) */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.filter(c => c.id !== 'other').map((cat) => {
            const stats = getCatStats(cat.id);
            const categoryProducts = products.filter(p => p.category === cat.id);

            return (
              <div
                key={cat.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-slate-800 rounded-xl">
                        {cat.id === 'fertilizers' ? <Sprout className="w-5 h-5 text-emerald-500" /> : cat.id === 'pesticides' ? <ShieldAlert className="w-5 h-5 text-rose-500" /> : <Wheat className="w-5 h-5 text-amber-500" />}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-100 text-base">{cat.name}</h3>
                        <span className="text-[10px] text-slate-400 font-mono">{stats.count} Products Registered</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-4">{cat.description}</p>

                  <div className="grid grid-cols-2 gap-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Category Stock Value</span>
                      <span className="text-sm font-extrabold text-emerald-400">
                        {settings.currencySymbol}{stats.totalVal.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Low Stock Items</span>
                      <span className={`text-sm font-extrabold ${stats.lowStock > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
                        {stats.lowStock} Items
                      </span>
                    </div>
                  </div>

                  {/* List of products in this category */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {categoryProducts.map(p => (
                      <div key={p.id} className="flex justify-between items-center text-xs bg-slate-800/40 p-2 rounded-lg border border-slate-700/40">
                        <div>
                          <div className="font-bold text-slate-200 line-clamp-1">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.unit}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-extrabold text-emerald-400">{settings.currencySymbol}{p.rate}</div>
                          <div className="text-[10px] text-slate-500">Stock: {p.stock}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onOpenAddProductModal}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-xl text-xs font-bold border border-slate-700 flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product to {cat.name.split(' ')[0]}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: SALES RECORDS LOGS & EDIT */}
      {activeTab === 'sales' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={salesSearch}
                onChange={(e) => setSalesSearch(e.target.value)}
                placeholder="Search Bill # or Customer..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-100"
              />
            </div>

            <div className="text-xs text-slate-400 font-bold">
              Showing {filteredSales.length} of {transactions.length} total transaction logs
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Bill No & Date</th>
                    <th className="py-3 px-4">Farmer / Customer</th>
                    <th className="py-3 px-4">Items Summary</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredSales.slice(0, 30).map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-100">
                        <div className="font-mono text-emerald-400">{tx.billNumber}</div>
                        <div className="text-[10px] text-slate-400">{tx.date}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-200">{tx.customerName || 'Walk-in'}</div>
                        <div className="text-[10px] text-slate-500">{tx.customerPhone || ''}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-300 font-medium">
                          {tx.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-[10px] font-bold">
                          {tx.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-extrabold text-emerald-400 text-sm">
                        {settings.currencySymbol}{tx.totalAmount.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => onOpenEditSaleModal(tx)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete sale ${tx.billNumber}?`)) {
                              onDeleteTransaction(tx.id);
                            }
                          }}
                          className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 rounded text-[11px] font-bold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: ADMIN SETTINGS & SECURITY */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Settings Form */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="text-lg font-extrabold text-slate-100 flex items-center space-x-2">
              <Settings className="w-5 h-5 text-amber-400" />
              <span>Shop Configuration & Security PIN</span>
            </h3>

            <form onSubmit={handleSettingsFormSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Shop / Business Name</label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400 block mb-1">Admin Security PIN (4-Digits)</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                    <input
                      type="text"
                      required
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-amber-400 font-mono font-extrabold text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Tagline / Subheading</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400 block mb-1">Shop Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400 block mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-extrabold"
                  />
                </div>
              </div>

              {settingsSaved && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>Admin settings and PIN saved successfully!</span>
                </div>
              )}

              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save All Admin Settings</span>
              </button>

            </form>
          </div>

          {/* Reset Demo Data Danger Zone */}
          <div className="lg:col-span-4 bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-lg space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Danger Zone • डेटा रिसेट</span>
              </div>
              <h4 className="font-extrabold text-slate-100 text-sm">Reset Sample Products & Sales</h4>
              <p className="text-xs text-slate-400 mt-1">
                Restores default sample fertilizers, pesticides, seeds, and initial 12-month sales logs.
              </p>
            </div>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset products and sales to initial default demo data? Custom edits will be restored.')) {
                  onResetData();
                }
              }}
              className="w-full bg-rose-500/10 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Default Demo Data</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
