import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  Sprout, 
  ShoppingBag, 
  BarChart3, 
  ShieldCheck, 
  Flame, 
  Menu,
  MoreVertical,
  X,
  PhoneCall,
  MapPin,
  ChevronRight
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (tab: 'rateboard' | 'pos' | 'analytics' | 'admin') => {
    if (tab === 'admin' && !isAdmin) {
      onOpenAdminLogin();
    } else {
      setActiveTab(tab);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg backdrop-blur-md bg-slate-900/95">
      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          
          {/* Shop Title & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-400 flex items-center justify-center text-white shadow-md shadow-emerald-950 ring-2 ring-emerald-500/30 shrink-0">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white">
                  {settings.shopName}
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Agri Manager
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium line-clamp-1 hidden sm:block">
                {settings.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Nav Tabs & Hamburger Menu Trigger */}
          <div className="flex items-center space-x-2">
            
            {/* Desktop Navigation Tabs */}
            <nav className="hidden lg:flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 shadow-inner">
              <button
                onClick={() => setActiveTab('rateboard')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50'
                    : 'text-amber-300 hover:text-amber-200 hover:bg-amber-500/20'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            </nav>

            {/* Admin Lock / Status (Desktop) */}
            <div className="hidden sm:block">
              {isAdmin ? (
                <div className="flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-1.5 rounded-xl text-xs font-bold">
                  <Unlock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Admin Mode</span>
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

            {/* ☰ / ⋮ Three-Dot & Three-Line Menu Trigger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-950/60 border border-emerald-400/40 cursor-pointer"
              aria-label="Toggle All Options Menu"
              title="All Options Menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <div className="flex items-center space-x-0.5">
                  <Menu className="w-4 h-4 text-white" />
                  <MoreVertical className="w-4 h-4 text-emerald-200" />
                </div>
              )}
              <span className="hidden sm:inline">All Options</span>
            </button>

          </div>
        </div>
      </div>

      {/* Right Side Full-Height Sidebar Overlay for Menu Options */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex justify-end h-screen w-screen overflow-hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div 
            className="bg-slate-900 border-l border-slate-800 w-80 sm:w-96 max-w-[90vw] h-full h-screen p-6 flex flex-col justify-between overflow-y-auto shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="space-y-6">
              {/* Header inside Menu */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base">{settings.shopName}</h3>
                    <p className="text-xs text-slate-400">Navigation & App Options</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Options List */}
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">
                  App Main Sections
                </div>

                <button
                  onClick={() => handleNavClick('rateboard')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                    activeTab === 'rateboard'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-extrabold'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/70 text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Rate Board (दर सूची)</div>
                      <div className="text-xs text-slate-400">Daily crop & product prices</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>

                <button
                  onClick={() => handleNavClick('pos')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                    activeTab === 'pos'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-extrabold'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/70 text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Quick Billing (बिक्री)</div>
                      <div className="text-xs text-slate-400">Create new sales bill & receipt</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>

                <button
                  onClick={() => handleNavClick('analytics')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                    activeTab === 'analytics'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-extrabold'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/70 text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Analytics & Graphs (ग्राफ)</div>
                      <div className="text-xs text-slate-400">Daily & monthly sales charts</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>

                <button
                  onClick={() => handleNavClick('admin')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                    activeTab === 'admin'
                      ? 'bg-amber-600/20 border-amber-500 text-amber-300 font-extrabold'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/70 text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Admin Panel</div>
                      <div className="text-xs text-slate-400">Stock, edit sales & store settings</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Status / Quick Info in Drawer */}
              <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl space-y-2">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Shop Information
                </div>
                <div className="text-xs text-slate-300 space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{settings.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{settings.phone}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-700 flex justify-between text-[11px] font-bold">
                    <span className="text-slate-400">Total Products:</span>
                    <span className="text-emerald-400">{totalProducts}</span>
                  </div>
                  {lowStockCount > 0 && (
                    <div className="flex justify-between text-[11px] font-bold text-amber-300">
                      <span>Low Stock Alert:</span>
                      <span>{lowStockCount} items</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Bottom Admin Login/Logout Button in Drawer */}
            <div className="pt-4 border-t border-slate-800">
              {isAdmin ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/30">
                    <div className="flex items-center space-x-2">
                      <Unlock className="w-4 h-4" />
                      <span>Admin Access Unlocked</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onAdminLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 rounded-xl text-xs font-bold transition-colors"
                  >
                    Logout Admin Mode
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenAdminLogin();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl text-xs font-bold transition-colors shadow-md"
                >
                  <Lock className="w-4 h-4" />
                  <span>Login as Admin</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </header>
  );
};


