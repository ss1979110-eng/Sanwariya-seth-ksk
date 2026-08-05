import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Sprout, 
  ShieldAlert, 
  Wheat, 
  Wrench, 
  DollarSign, 
  FileSpreadsheet, 
  Download, 
  Filter,
  Edit,
  Trash2,
  Search,
  Receipt,
  XCircle,
  Sparkles
} from 'lucide-react';
import { SaleTransaction, AdminSettings, ProductCategory } from '../types';

interface SalesAnalyticsProps {
  transactions: SaleTransaction[];
  settings: AdminSettings;
  onOpenEditSaleModal?: (transaction: SaleTransaction) => void;
  onDeleteTransaction?: (transactionId: string) => void;
}

const CATEGORY_COLORS: Record<ProductCategory, string> = {
  fertilizers: '#10b981', // emerald
  pesticides: '#f43f5e',  // rose
  seeds: '#f59e0b',       // amber
  other: '#3b82f6',       // blue
};

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({
  transactions,
  settings,
  onOpenEditSaleModal,
  onDeleteTransaction,
}) => {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedExactDate, setSelectedExactDate] = useState<string>('');
  const [saleSearch, setSaleSearch] = useState('');
  const [showAllList, setShowAllList] = useState(false);

  // Today's Sales Calculation
  const now = new Date();
  const todayDateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  const todayTransactions = useMemo(() => transactions.filter(t => t.date === todayDateStr), [transactions, todayDateStr]);
  const todayTotalSalesAmount = useMemo(() => todayTransactions.reduce((sum, t) => sum + t.totalAmount, 0), [todayTransactions]);

  // Available years in transactions
  const availableYears = useMemo(() => {
    const set = new Set<number>();
    set.add(new Date().getFullYear());
    transactions.forEach(t => set.add(t.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [transactions]);

  // Filter transactions based on selection (year, month, exact date, category)
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (selectedYear !== 'all' && t.year !== selectedYear) return false;
      if (selectedMonth !== 'all') {
        const txMonth = parseInt(t.month.split('-')[1], 10) - 1;
        if (txMonth !== selectedMonth) return false;
      }
      if (selectedExactDate && t.date !== selectedExactDate) return false;
      if (selectedCategory !== 'all') {
        const hasCatItem = t.items.some(i => i.category === selectedCategory);
        if (!hasCatItem) return false;
      }
      return true;
    });
  }, [transactions, selectedYear, selectedMonth, selectedExactDate, selectedCategory]);

  // Overall KPI Calculations
  const metrics = useMemo(() => {
    let totalRev = 0;
    let fertRev = 0;
    let pestRev = 0;
    let seedRev = 0;
    let othRev = 0;

    filteredTransactions.forEach(t => {
      totalRev += t.totalAmount;
      t.items.forEach(i => {
        if (selectedCategory !== 'all' && i.category !== selectedCategory) return;
        if (i.category === 'fertilizers') fertRev += i.total;
        else if (i.category === 'pesticides') pestRev += i.total;
        else if (i.category === 'seeds') seedRev += i.total;
        else othRev += i.total;
      });
    });

    return {
      totalRev,
      fertRev,
      pestRev,
      seedRev,
      othRev,
      count: filteredTransactions.length,
    };
  }, [filteredTransactions, selectedCategory]);

  // Yearly Month-by-Month Chart Data
  const yearlyChartData = useMemo(() => {
    const monthlyData = MONTH_NAMES.map((name, index) => ({
      month: name,
      monthIndex: index,
      Fertilizers: 0,
      Pesticides: 0,
      Seeds: 0,
      Others: 0,
      TotalSales: 0,
    }));

    transactions
      .filter(t => t.year === selectedYear)
      .forEach(t => {
        const monthIdx = parseInt(t.month.split('-')[1], 10) - 1;
        if (monthIdx >= 0 && monthIdx < 12) {
          monthlyData[monthIdx].TotalSales += t.totalAmount;
          t.items.forEach(item => {
            if (item.category === 'fertilizers') monthlyData[monthIdx].Fertilizers += item.total;
            else if (item.category === 'pesticides') monthlyData[monthIdx].Pesticides += item.total;
            else if (item.category === 'seeds') monthlyData[monthIdx].Seeds += item.total;
            else monthlyData[monthIdx].Others += item.total;
          });
        }
      });

    return monthlyData;
  }, [transactions, selectedYear]);

  // Category Share Donut Data
  const categoryPieData = useMemo(() => {
    return [
      { name: 'Fertilizers', value: metrics.fertRev, color: CATEGORY_COLORS.fertilizers },
      { name: 'Pesticides', value: metrics.pestRev, color: CATEGORY_COLORS.pesticides },
      { name: 'Seeds', value: metrics.seedRev, color: CATEGORY_COLORS.seeds },
      { name: 'Others', value: metrics.othRev, color: CATEGORY_COLORS.other },
    ].filter(d => d.value > 0);
  }, [metrics]);

  // Top Products Data
  const topProductsData = useMemo(() => {
    const map = new Map<string, { name: string; category: ProductCategory; totalSales: number; qty: number }>();

    filteredTransactions.forEach(t => {
      t.items.forEach(i => {
        if (selectedCategory !== 'all' && i.category !== selectedCategory) return;
        const existing = map.get(i.productId) || {
          name: i.productName,
          category: i.category,
          totalSales: 0,
          qty: 0,
        };
        existing.totalSales += i.total;
        existing.qty += i.quantity;
        map.set(i.productId, existing);
      });
    });

    return Array.from(map.values())
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 6);
  }, [filteredTransactions, selectedCategory]);

  // Search filtered list for table view
  const searchedTransactions = useMemo(() => {
    if (!saleSearch.trim()) return filteredTransactions;
    const term = saleSearch.toLowerCase();
    return filteredTransactions.filter(t => 
      t.billNumber.toLowerCase().includes(term) ||
      (t.customerName && t.customerName.toLowerCase().includes(term)) ||
      (t.customerPhone && t.customerPhone.includes(term)) ||
      t.items.some(i => i.productName.toLowerCase().includes(term))
    );
  }, [filteredTransactions, saleSearch]);

  const displayedTransactionsList = showAllList ? searchedTransactions : searchedTransactions.slice(0, 30);

  // Export CSV Handler
  const exportToCSV = () => {
    const headers = ['Bill Number', 'Date', 'Customer Name', 'Payment Method', 'Items Count', 'Total Amount'];
    const rows = filteredTransactions.map(t => [
      t.billNumber,
      t.date,
      `"${t.customerName || 'N/A'}"`,
      t.paymentMethod,
      t.items.length,
      t.totalAmount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sales_Report_${selectedYear}_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Analytics Banner */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Sales Analytics & Growth Graphs • बिक्री विश्लेषण</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100">
            Monthly & Yearly Sales Performance
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track category sales distribution for Fertilizers, Pesticides, and Seeds with custom filters.
          </p>
        </div>

        {/* Global Filters */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          
          {/* Exact Date Picker */}
          <div className="flex items-center space-x-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:inline">Date:</span>
            <input
              type="date"
              value={selectedExactDate}
              onChange={(e) => setSelectedExactDate(e.target.value)}
              className="bg-transparent text-slate-100 font-mono text-xs focus:outline-none cursor-pointer"
            />
          </div>

          {/* Year Selector */}
          <div className="flex items-center space-x-1 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:inline">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-transparent text-slate-100 font-bold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-slate-100">All Years</option>
              {availableYears.map(yr => (
                <option key={yr} value={yr} className="bg-slate-900 text-slate-100">
                  Year {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Month Selector */}
          <div className="flex items-center space-x-1 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-transparent text-slate-100 font-bold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-slate-100">All 12 Months</option>
              {MONTH_NAMES.map((m, idx) => (
                <option key={m} value={idx} className="bg-slate-900 text-slate-100">{m}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {(selectedExactDate || selectedYear !== 'all' || selectedMonth !== 'all' || selectedCategory !== 'all' || saleSearch) && (
            <button
              onClick={() => {
                setSelectedExactDate('');
                setSelectedYear('all');
                setSelectedMonth('all');
                setSelectedCategory('all');
                setSaleSearch('');
              }}
              className="flex items-center space-x-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold px-2.5 py-1.5 rounded-xl text-xs transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Export CSV */}
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Selected Sales */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {settings.currencySymbol}{metrics.totalRev.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            From {metrics.count} completed bills ({selectedYear})
          </p>
        </div>

        {/* Fertilizers Revenue */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Fertilizers (खाद)</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100">
            {settings.currencySymbol}{metrics.fertRev.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            {metrics.totalRev ? Math.round((metrics.fertRev / metrics.totalRev) * 100) : 0}% of overall sales
          </p>
        </div>

        {/* Pesticides Revenue */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Pesticides (कीटनाशक)</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100">
            {settings.currencySymbol}{metrics.pestRev.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            {metrics.totalRev ? Math.round((metrics.pestRev / metrics.totalRev) * 100) : 0}% of overall sales
          </p>
        </div>

        {/* Seeds Revenue */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Seeds (बीज)</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100">
            {settings.currencySymbol}{metrics.seedRev.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            {metrics.totalRev ? Math.round((metrics.seedRev / metrics.totalRev) * 100) : 0}% of overall sales
          </p>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Yearly Month-by-Month Sales Graph */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-100 text-base">Yearly Monthly Sales Trend ({selectedYear})</h3>
              <p className="text-xs text-slate-400">Monthly breakdown across Fertilizers, Pesticides, and Seeds</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any) => [`${settings.currencySymbol}${Number(value).toLocaleString()}`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Fertilizers" stackId="a" fill={CATEGORY_COLORS.fertilizers} radius={[0, 0, 0, 0]} />
                <Bar dataKey="Pesticides" stackId="a" fill={CATEGORY_COLORS.pesticides} radius={[0, 0, 0, 0]} />
                <Bar dataKey="Seeds" stackId="a" fill={CATEGORY_COLORS.seeds} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut Chart */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-100 text-base">Category Sales Ratio</h3>
            <p className="text-xs text-slate-400">Revenue split across agri categories</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [`${settings.currencySymbol}${Number(val).toLocaleString()}`, 'Sales']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
            {categoryPieData.map((cat) => (
              <div key={cat.name} className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-300 font-medium text-[11px] truncate">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Products Ranking */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-100 text-base">Top Revenue Generating Products</h3>
          <p className="text-xs text-slate-400">Highest grossing items in {selectedYear}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {topProductsData.map((prod, idx) => (
            <div
              key={prod.name}
              className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-extrabold text-xs">
                  #{idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-xs line-clamp-1">{prod.name}</h4>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">{prod.category}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-extrabold text-emerald-400 text-xs">
                  {settings.currencySymbol}{prod.totalSales.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400">{prod.qty} units sold</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Transactions & Edit Table for Selected Year */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-slate-100 text-base">
                Sales Records & Edit Options ({selectedYear})
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Select or edit past sale records for Year {selectedYear}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={saleSearch}
                onChange={(e) => setSaleSearch(e.target.value)}
                placeholder="Search Bill # or Customer..."
                className="bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            {searchedTransactions.length > 30 && (
              <button
                onClick={() => setShowAllList(!showAllList)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
              >
                {showAllList ? 'Show Top 30' : `Show All (${searchedTransactions.length})`}
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Bill No & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {displayedTransactionsList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    No sales records found for Year {selectedYear}.
                  </td>
                </tr>
              ) : (
                displayedTransactionsList.map((tx) => (
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
                      <div className="text-slate-300 font-medium line-clamp-2">
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

                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      {onOpenEditSaleModal && (
                        <button
                          onClick={() => onOpenEditSaleModal(tx)}
                          className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded text-xs font-bold inline-flex items-center space-x-1 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}
                      {onDeleteTransaction && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete sale bill ${tx.billNumber}?`)) {
                              onDeleteTransaction(tx.id);
                            }
                          }}
                          className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 rounded text-xs font-bold inline-flex items-center space-x-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
