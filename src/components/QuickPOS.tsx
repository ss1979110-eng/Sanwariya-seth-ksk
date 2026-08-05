import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  User, 
  Phone, 
  CreditCard, 
  Receipt, 
  Search, 
  Sprout, 
  ShieldAlert, 
  Wheat, 
  Wrench,
  Printer,
  Sparkles,
  Calendar
} from 'lucide-react';
import { Product, SaleItem, SaleTransaction, AdminSettings, ProductCategory } from '../types';

interface QuickPOSProps {
  products: Product[];
  settings: AdminSettings;
  onRecordSale: (transaction: SaleTransaction) => void;
  preselectedProduct?: Product | null;
  onClearPreselected?: () => void;
}

export const QuickPOS: React.FC<QuickPOSProps> = ({
  products,
  settings,
  onRecordSale,
  preselectedProduct,
  onClearPreselected,
}) => {
  const [saleMode, setSaleMode] = useState<'itemized' | 'direct'>('itemized');

  // Itemized cart state
  const [cart, setCart] = useState<SaleItem[]>(() => {
    if (preselectedProduct) {
      return [{
        productId: preselectedProduct.id,
        productName: preselectedProduct.name,
        category: preselectedProduct.category,
        unit: preselectedProduct.unit,
        rate: preselectedProduct.rate,
        quantity: 1,
        total: preselectedProduct.rate,
      }];
    }
    return [];
  });

  // Direct Total Sale state
  const [directAmount, setDirectAmount] = useState<string>('');
  const [directCategory, setDirectCategory] = useState<ProductCategory>('fertilizers');

  // Shared sale state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [saleDate, setSaleDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  });
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Credit' | 'Bank Transfer'>('Cash');
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [recentReceipt, setRecentReceipt] = useState<SaleTransaction | null>(null);

  // Cart operations
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.productId === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.rate }
            : item
        );
      }
      return [
        ...prevCart,
        {
          productId: product.id,
          productName: product.name,
          category: product.category,
          unit: product.unit,
          rate: product.rate,
          quantity: 1,
          total: product.rate,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQty, total: newQty * item.rate }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  // Handle Itemized Checkout
  const handleItemizedCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const selectedDateObj = saleDate ? new Date(saleDate + 'T00:00:00') : new Date();
    const year = selectedDateObj.getFullYear();
    const monthStr = (selectedDateObj.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = selectedDateObj.getDate().toString().padStart(2, '0');
    const monthKey = `${year}-${monthStr}`;
    const dateStr = saleDate || `${year}-${monthStr}-${dayStr}`;
    const billNum = `BILL-${Date.now().toString().slice(-6)}`;

    const newTransaction: SaleTransaction = {
      id: `tx-${Date.now()}`,
      billNumber: billNum,
      customerName: customerName.trim() || 'Walk-in Farmer Customer',
      customerPhone: customerPhone.trim() || 'N/A',
      date: dateStr,
      month: monthKey,
      year: year,
      items: cart,
      totalAmount: cartTotal,
      paymentMethod,
      notes,
    };

    onRecordSale(newTransaction);
    setRecentReceipt(newTransaction);

    // Reset form
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
    if (onClearPreselected) onClearPreselected();
  };

  // Handle Direct Total Sale Checkout
  const handleDirectSaleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(directAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid sale amount in ₹.');
      return;
    }

    const selectedDateObj = saleDate ? new Date(saleDate + 'T00:00:00') : new Date();
    const year = selectedDateObj.getFullYear();
    const monthStr = (selectedDateObj.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = selectedDateObj.getDate().toString().padStart(2, '0');
    const monthKey = `${year}-${monthStr}`;
    const dateStr = saleDate || `${year}-${monthStr}-${dayStr}`;
    const billNum = `BILL-DIRECT-${Date.now().toString().slice(-6)}`;

    const categoryNames: Record<ProductCategory, string> = {
      fertilizers: 'Direct Fertilizer Sale',
      pesticides: 'Direct Pesticide Sale',
      seeds: 'Direct Seeds Sale',
      other: 'Direct General Agri Sale'
    };

    const newTransaction: SaleTransaction = {
      id: `tx-direct-${Date.now()}`,
      billNumber: billNum,
      customerName: customerName.trim() || 'Direct Cash Sale',
      customerPhone: customerPhone.trim() || 'N/A',
      date: dateStr,
      month: monthKey,
      year: year,
      items: [{
        productId: `direct-${directCategory}`,
        productName: `${categoryNames[directCategory]} (कुल बिक्री)`,
        category: directCategory,
        unit: '₹ Lump-Sum',
        rate: amount,
        quantity: 1,
        total: amount,
      }],
      totalAmount: amount,
      paymentMethod,
      notes: notes ? `Direct Sale Entry - ${notes}` : 'Direct Sale Entry',
    };

    onRecordSale(newTransaction);
    setRecentReceipt(newTransaction);

    // Reset form
    setDirectAmount('');
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      (p.brand && p.brand.toLowerCase().includes(query));
    return matchesCat && matchesSearch;
  });

  const getCategoryIcon = (catId: ProductCategory) => {
    switch (catId) {
      case 'fertilizers':
        return <Sprout className="w-4 h-4 text-emerald-500" />;
      case 'pesticides':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'seeds':
        return <Wheat className="w-4 h-4 text-amber-500" />;
      default:
        return <Wrench className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Point of Sale • त्वरित काउंटर बिक्री</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">Record New Sale Transaction</h2>
          <p className="text-xs text-slate-400">Choose item-wise billing or enter direct total sale in Rupees for any exact date.</p>
        </div>

        {/* Sale Mode Toggle Switch */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 shrink-0">
          <button
            onClick={() => setSaleMode('itemized')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              saleMode === 'itemized'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Item-wise Bill (सामग्री अनुसार)
          </button>
          <button
            onClick={() => setSaleMode('direct')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              saleMode === 'direct'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Direct ₹ Total Sale (केवल कुल बिक्री)
          </button>
        </div>
      </div>

      {saleMode === 'direct' ? (
        /* Direct Total Sale Entry Form */
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Quick Lump-Sum Entry • सीधी कुल बिक्री दर्ज करें</span>
            </div>
            <h3 className="text-lg font-black text-white">Direct Total Sale in Rupees (₹)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Record total revenue directly without selecting items. It will instantly update all real-time graphs and daily totals for the exact date.
            </p>
          </div>

          <form onSubmit={handleDirectSaleCheckout} className="space-y-5">
            {/* Amount & Date Input Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Total Sale Amount Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                  <span>Total Sale Amount (कुल राशि ₹) *</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 font-black text-lg">
                    {settings.currencySymbol}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={directAmount}
                    onChange={(e) => setDirectAmount(e.target.value)}
                    placeholder="Enter total sale in ₹"
                    className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl pl-9 pr-3 py-3 text-lg font-black text-emerald-400 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Exact Date Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sale Date (तारीख चुनें) *</span>
                </label>
                <input
                  type="date"
                  required
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm text-slate-100 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

            </div>

            {/* Category Selector for Graph & Analytics */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Category for Graph Analytics (श्रेणी चुनें)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'fertilizers', name: 'Fertilizers (उर्वरक)', icon: <Sprout className="w-4 h-4 text-emerald-400" /> },
                  { id: 'pesticides', name: 'Pesticides (कीटनाशक)', icon: <ShieldAlert className="w-4 h-4 text-rose-400" /> },
                  { id: 'seeds', name: 'Seeds (बीज)', icon: <Wheat className="w-4 h-4 text-amber-400" /> },
                  { id: 'other', name: 'General Agri (अन्य)', icon: <Wrench className="w-4 h-4 text-blue-400" /> },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setDirectCategory(cat.id as ProductCategory)}
                    className={`p-3 rounded-xl border flex items-center space-x-2 text-xs font-bold transition-all ${
                      directCategory === cat.id
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {cat.icon}
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details Optional Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Customer Name (optional)</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Walk-in Cash Sale"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Mobile Number (optional)</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Mobile number"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Payment Mode (भुगतान का प्रकार)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Cash', 'UPI', 'Credit', 'Bank Transfer'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMethod(mode)}
                    className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition-all text-center ${
                      paymentMethod === mode
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Notes / Remarks (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Counter direct bulk sale entry"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 rounded-xl font-black text-sm flex items-center justify-center space-x-2 shadow-xl shadow-emerald-950 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Record Direct Sale & Update Graphs (₹ बिक्री दर्ज करें)</span>
              </button>
            </div>

          </form>
        </div>
      ) : (
        /* Itemized Product Selection & Cart Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Product Selection Grid */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Category Filter & Search Bar */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedCategory === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSelectedCategory('fertilizers')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
                      selectedCategory === 'fertilizers' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Sprout className="w-3.5 h-3.5" />
                    <span>Fertilizers</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('pesticides')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
                      selectedCategory === 'pesticides' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Pesticides</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('seeds')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
                      selectedCategory === 'seeds' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Wheat className="w-3.5 h-3.5" />
                    <span>Seeds</span>
                  </button>
                </div>

                <div className="relative w-full sm:w-48">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Quick search..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Product Items Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const inCart = cart.find((item) => item.productId === p.id);
                const isOutOfStock = p.stock <= 0;

                return (
                  <div
                    key={p.id}
                    onClick={() => !isOutOfStock && addToCart(p)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isOutOfStock
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-60 cursor-not-allowed'
                        : inCart
                        ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="flex items-center space-x-1 font-semibold text-slate-400">
                          {getCategoryIcon(p.category)}
                          <span className="capitalize text-[10px]">{p.category}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold bg-slate-800 px-1.5 py-0.5 rounded">
                          {p.brand || 'Agri'}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-100 text-xs leading-tight mb-1">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">{p.unit}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80">
                      <div>
                        <span className="text-sm font-extrabold text-emerald-400">
                          {settings.currencySymbol}{p.rate}
                        </span>
                        <span className="text-[10px] text-slate-400 block">Stock: {p.stock}</span>
                      </div>

                      <button
                        type="button"
                        disabled={isOutOfStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isOutOfStock) addToCart(p);
                        }}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                          inCart
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white'
                        }`}
                      >
                        {inCart ? `Selected (${inCart.quantity})` : '+ Add'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Active Cart & Checkout Panel */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Receipt className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-slate-100 text-base">Current Bill Items</h3>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  {cart.length} Item(s)
                </span>
              </div>

              {/* Cart Items List */}
              {cart.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  Select items from the catalog on the left to build customer bill.
                </div>
              ) : (
                <div className="space-y-2.5 my-4 max-h-[280px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 text-xs"
                    >
                      <div className="flex-1 pr-2">
                        <div className="font-bold text-slate-200 line-clamp-1">{item.productName}</div>
                        <div className="text-[11px] text-slate-400">
                          {settings.currencySymbol}{item.rate} × {item.quantity} {item.unit}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-900">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="px-2 py-0.5 text-slate-300 hover:bg-slate-800 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-slate-100 font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="px-2 py-0.5 text-slate-300 hover:bg-slate-800 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-extrabold text-emerald-400 min-w-[50px] text-right">
                          {settings.currencySymbol}{item.total}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Details Form & Total */}
            <form onSubmit={handleItemizedCheckout} className="space-y-3 pt-3 border-t border-slate-800">
              
              {/* Customer Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Customer Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Farmer Name"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Phone number"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sale Date & Payment Mode */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1 mb-1">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    <span>Sale Date (तारीख)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={saleDate}
                      onChange={(e) => setSaleDate(e.target.value)}
                      required
                      className="w-full bg-slate-800 border border-emerald-500/40 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Payment Mode
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    {(['Cash', 'UPI', 'Credit', 'Bank Transfer'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPaymentMethod(mode)}
                        className={`py-1 px-1 rounded text-[10px] font-bold border transition-all text-center truncate ${
                          paymentMethod === mode
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grand Total Display */}
              <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 flex items-center justify-between mt-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Grand Total Amount
                  </span>
                  <span className="text-2xl font-black text-emerald-400">
                    {settings.currencySymbol}{cartTotal.toLocaleString()}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={cart.length === 0}
                  className={`px-5 py-3 rounded-xl font-extrabold text-xs flex items-center space-x-2 transition-transform active:scale-95 ${
                    cart.length === 0
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-950'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Sale</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

      {/* Success Receipt Popup Card */}
      {recentReceipt && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-extrabold text-base text-slate-100">Sale Recorded Successfully</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">{recentReceipt.billNumber}</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Customer:</span>
                <span className="font-bold text-slate-100">{recentReceipt.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Date:</span>
                <span className="font-bold text-slate-100">{recentReceipt.date}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Payment Mode:</span>
                <span className="font-bold text-emerald-400">{recentReceipt.paymentMethod}</span>
              </div>

              <div className="border-t border-slate-800 my-2 pt-2 space-y-1">
                {recentReceipt.items.map((it) => (
                  <div key={it.productId} className="flex justify-between text-slate-400 text-[11px]">
                    <span>{it.productName} ({it.quantity} × {it.unit})</span>
                    <span className="font-mono text-slate-200">{settings.currencySymbol}{it.total}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-extrabold text-emerald-400">
                <span>Total Amount Paid:</span>
                <span>{settings.currencySymbol}{recentReceipt.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border border-slate-700"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill</span>
              </button>
              <button
                onClick={() => setRecentReceipt(null)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
