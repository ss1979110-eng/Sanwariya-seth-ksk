import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RateBoard } from './components/RateBoard';
import { QuickPOS } from './components/QuickPOS';
import { SalesAnalytics } from './components/SalesAnalytics';
import { AdminDashboard } from './components/AdminPanel/AdminDashboard';
import { AdminLoginModal } from './components/AdminPanel/AdminLoginModal';
import { ProductModal } from './components/AdminPanel/ProductModal';
import { SaleModal } from './components/AdminPanel/SaleModal';

import { Product, SaleTransaction, AdminSettings } from './types';
import { 
  getStoredProducts, 
  saveStoredProducts, 
  getStoredTransactions, 
  saveStoredTransactions, 
  getStoredSettings, 
  saveStoredSettings, 
  getAdminAuthStatus, 
  setAdminAuthStatus, 
  resetToDemoData 
} from './utils/storage';

export default function App() {
  // Core state from storage
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [transactions, setTransactions] = useState<SaleTransaction[]>(() => getStoredTransactions());
  const [settings, setSettings] = useState<AdminSettings>(() => getStoredSettings());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => getAdminAuthStatus());

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'rateboard' | 'pos' | 'analytics' | 'admin'>('rateboard');

  // Modal visibility & selection states
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [saleToEdit, setSaleToEdit] = useState<SaleTransaction | null>(null);

  const [preselectedPosProduct, setPreselectedPosProduct] = useState<Product | null>(null);

  // Sync products state to storage
  const handleUpdateProductsList = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveStoredProducts(newProducts);
  };

  // Sync transactions state to storage
  const handleUpdateTransactionsList = (newTxList: SaleTransaction[]) => {
    setTransactions(newTxList);
    saveStoredTransactions(newTxList);
  };

  // Admin Auth Handlers
  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setAdminAuthStatus(true);
    setIsAdminLoginOpen(false);
    setActiveTab('admin');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminAuthStatus(false);
    if (activeTab === 'admin') {
      setActiveTab('rateboard');
    }
  };

  // Product CRUD
  const handleSaveProduct = (product: Product) => {
    const exists = products.some((p) => p.id === product.id);
    let updated: Product[];
    if (exists) {
      updated = products.map((p) => (p.id === product.id ? product : p));
    } else {
      updated = [product, ...products];
    }
    handleUpdateProductsList(updated);
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    handleUpdateProductsList(updated);
  };

  // Sales Recording & Stock deduction
  const handleRecordSale = (transaction: SaleTransaction) => {
    // 1. Add transaction to history
    const updatedTx = [transaction, ...transactions];
    handleUpdateTransactionsList(updatedTx);

    // 2. Deduct product inventory stock
    const updatedProducts = products.map((p) => {
      const itemInSale = transaction.items.find((it) => it.productId === p.id);
      if (itemInSale) {
        const newStock = Math.max(0, p.stock - itemInSale.quantity);
        return { ...p, stock: newStock, updatedAt: new Date().toISOString() };
      }
      return p;
    });

    handleUpdateProductsList(updatedProducts);
  };

  // Past Sale Editing
  const handleSaveTransactionEdit = (updatedTx: SaleTransaction) => {
    const updatedList = transactions.map((t) => (t.id === updatedTx.id ? updatedTx : t));
    handleUpdateTransactionsList(updatedList);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    const updatedList = transactions.filter((t) => t.id !== transactionId);
    handleUpdateTransactionsList(updatedList);
  };

  // Settings Save
  const handleSaveSettings = (newSettings: AdminSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  // Reset Demo Data
  const handleResetData = () => {
    resetToDemoData();
    setProducts(getStoredProducts());
    setTransactions(getStoredTransactions());
    setSettings(getStoredSettings());
  };

  // Low stock counter
  const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* App Header & Navigation */}
      <Header
        settings={settings}
        isAdmin={isAdmin}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={handleAdminLogout}
        totalProducts={products.length}
        lowStockCount={lowStockCount}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {activeTab === 'rateboard' && (
          <RateBoard
            products={products}
            settings={settings}
            isAdmin={isAdmin}
            onEditProductRate={(prod) => {
              setProductToEdit(prod);
              setIsProductModalOpen(true);
            }}
            onAddNewProduct={() => {
              setProductToEdit(null);
              setIsProductModalOpen(true);
            }}
            onQuickSaleSelect={(prod) => {
              setPreselectedPosProduct(prod);
              setActiveTab('pos');
            }}
          />
        )}

        {activeTab === 'pos' && (
          <QuickPOS
            products={products}
            settings={settings}
            onRecordSale={handleRecordSale}
            preselectedProduct={preselectedPosProduct}
            onClearPreselected={() => setPreselectedPosProduct(null)}
          />
        )}

        {activeTab === 'analytics' && (
          <SalesAnalytics
            transactions={transactions}
            settings={settings}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            products={products}
            transactions={transactions}
            settings={settings}
            onUpdateProduct={(prod) => {
              setProductToEdit(prod);
              setIsProductModalOpen(true);
            }}
            onDeleteProduct={handleDeleteProduct}
            onOpenAddProductModal={() => {
              setProductToEdit(null);
              setIsProductModalOpen(true);
            }}
            onUpdateTransaction={handleSaveTransactionEdit}
            onDeleteTransaction={handleDeleteTransaction}
            onOpenEditSaleModal={(tx) => {
              setSaleToEdit(tx);
              setIsSaleModalOpen(true);
            }}
            onSaveSettings={handleSaveSettings}
            onResetData={handleResetData}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {settings.shopName} • Agri Sales & Rate Management</span>
          <span className="text-[11px] text-slate-400">
            Dedicated Sections: Fertilizers (खाद) | Pesticides (कीटनाशक) | Seeds (बीज)
          </span>
        </div>
      </footer>

      {/* Admin Login PIN Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        correctPin={settings.adminPin}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Add / Edit Product & Rate Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        settings={settings}
      />

      {/* Edit Sale Modal */}
      <SaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onSave={handleSaveTransactionEdit}
        saleToEdit={saleToEdit}
        settings={settings}
      />

    </div>
  );
}
