import React from 'react';
import { 
  Lock, 
  Unlock, 
  Sprout, 
  ShoppingBag, 
  BarChart3, 
  ShieldCheck, 
  Flame, 
  PhoneCall, 
  MapPin,
  Wifi
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
    <header className="bg-slate-900 text-white border-b border-slate-800/80 sticky top-0 z-30 shadow-lg backdrop-blur-md bg-slate-900/95">
      {/* Top Utility Info Bar */}
      <div className="bg-emerald-950/90 text-emerald-100 text-[11px] py-1.5 px-4 sm:px-6 flex flex-wrap justify-between items-center border-b border-emerald-900/60 gap-2">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5 font-medium text-emerald-200">
            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-none">{settings.address}</span>
          </span>
          <span className="hidden sm:flex items-center space-x-1.5 text-emerald-300">
            <PhoneCall className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>{settings.phone}</span>
          </span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] font-semibold">
          <span className="flex items-center space-x-1.5 bg-emerald-900/60 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
            <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Cloud Sync Active</span>
          </span>
          <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
            {totalProducts} Products
          </span>
          {lowStockCount > 0 && (
            <span className="bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 animate-pulse font-bold">
              ⚠️ {lowStockCount} Low Stock
            </span>
          )}
        </div>
      </div>

      {/* Main Branding & Navigation Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
          
          {/* Shop Title & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-400 flex items-center justify-center text-white shadow-md shadow-emerald-950 ring-2 ring-emerald-500/30 shrink-0">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white">
                  {settings.shopName}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Agri Manager
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium line-clamp-1">
                {settings.tagline}
              </p>
            </div>
          </div>

          {/* Navigation Controls & Admin Auth Button */}
          <div className="flex items-center justify-between md:justify-end space-x-2 flex-wrap gap-2">
            
            {/* Nav Tabs */}
            <nav className="flex bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 shadow-inner overflow-x-auto">
              <button
                onClick={() => setActiveTab('rateboard')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'rateboard'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Rate Board (दर सूची)</span>
              </button>

              <button
                onClick={() => setActiveTab('pos')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'pos'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Billing (बिक्री)</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Analytics (ग्राफ)</span>
              </button>

              <button
                onClick={() => {
                  if (isAdmin) {
                    setActiveTab('admin');
                  } else {
                    onOpenAdminLogin();
                  }
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'admin'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50'
                    : 'text-amber-300 hover:text-amber-200 hover:bg-amber-500/20'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            </nav>

            {/* Admin Lock Status */}
            <div>
              {isAdmin ? (
                <div className="flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-xl text-xs font-bold">
                  <Unlock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden sm:inline">Admin Mode</span>
                  <button
                    onClick={onAdminLogout}
                    className="ml-1 text-[10px] bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 px-2 py-0.5 rounded-md transition-colors font-extrabold"
                    title="Lock Admin Panel"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAdminLogin}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-sm"
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

