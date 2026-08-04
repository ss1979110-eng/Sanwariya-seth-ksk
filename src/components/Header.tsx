import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  Sprout, 
  ShoppingBag, 
  BarChart3, 
  ShieldCheck, 
  Flame, 
  PlusCircle, 
  PhoneCall, 
  MapPin,
  RefreshCw
} from 'lucide-react';
import { AdminSettings } from '../types';

interface HeaderProps {
  settings: AdminSettings;
  isAdmin: boolean;
  activeTab: 'rateboard' | 'pos' | 'analytics' | 'admin';
  setActiveTab: (tab: 'rateboard' | 'pos' | 'analytics' | 'admin') => void;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  totalProducts: number;
  lowStockCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  isAdmin,
  activeTab,
  setActiveTab,
  onOpenAdminLogin,
  onAdminLogout,
  totalProducts,
  lowStockCount,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Notification / Info Bar */}
      <div className="bg-emerald-800/90 text-emerald-100 text-xs py-1.5 px-4 flex flex-wrap justify-between items-center border-b border-emerald-700/50">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            <span>{settings.address}</span>
          </span>
          <span className="hidden sm:inline flex items-center space-x-1 text-emerald-200">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-300" />
            <span>{settings.phone}</span>
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs font-semibold">
          <span className="flex items-center space-x-1.5 bg-emerald-950/80 text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cloud Live Sync</span>
          </span>
          <span className="bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
            Active Catalog: {totalProducts} Products
          </span>
          {lowStockCount > 0 && (
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 animate-pulse">
              ⚠️ {lowStockCount} Low Stock Items
            </span>
          )}
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
          
          {/* Shop Title & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 ring-2 ring-emerald-400/30">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                  {settings.shopName}
                </h1>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Agri POS & Rates
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                {settings.tagline}
              </p>
            </div>
          </div>

          {/* Navigation Controls & Admin Auth Button */}
          <div className="flex items-center justify-between sm:justify-end space-x-2 flex-wrap gap-y-2">
            
            {/* View Switchers */}
            <div className="flex bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
              <button
                onClick={() => setActiveTab('rateboard')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'rateboard'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Rate Board (दर सूची)</span>
              </button>

              <button
                onClick={() => setActiveTab('pos')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'pos'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Sale (बिक्री)</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Graphs (ग्राफ)</span>
              </button>

              <button
                onClick={() => {
                  if (isAdmin) {
                    setActiveTab('admin');
                  } else {
                    onOpenAdminLogin();
                  }
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-amber-300 hover:text-amber-200 hover:bg-amber-500/20'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            </div>

            {/* Admin Lock / Unlock Status Toggle */}
            <div>
              {isAdmin ? (
                <div className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-lg text-xs font-medium">
                  <Unlock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">Admin Mode</span>
                  <button
                    onClick={onAdminLogout}
                    className="ml-1 text-[10px] bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 px-1.5 py-0.5 rounded transition-colors font-bold"
                    title="Lock Admin Panel"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAdminLogin}
                  className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Admin Login</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
