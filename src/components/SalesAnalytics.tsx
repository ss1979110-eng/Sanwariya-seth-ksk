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
  const [chartViewMode, setChartViewMode] = useState<'daily' | 'monthly'>('daily');

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

  // Exact Date Day-by-Day Chart Data
  const dailyChartData = useMemo(() => {
    const map = new Map<string, { dateStr: string; displayDate: string; TotalSales: number; Fertilizers: number; Pesticides: number; Seeds: number; Others: number }>();

    transactions
      .filter(t => {
        if (selectedYear !== 'all' && t.year !== selectedYear) return false;
        if (selectedMonth !== 'all') {
          const monthIdx = parseInt(t.month.split('-')[1], 10) - 1;
          if (monthIdx !== selectedMonth) return false;
        }
        return true;
      })
      .forEach(t => {
        const rawDate = t.date; // e.g. "2026-08-04"
        const parts = rawDate ? rawDate.split('-') : [];
        const formattedLabel = parts.length === 3 ? `${parts[2]}/${parts[1]}` : rawDate;

        const existing = map.get(rawDate) || {
          dateStr: rawDate,
          displayDate: formattedLabel,
          TotalSales: 0,
          Fertilizers: 0,
          Pesticides: 0,
          Seeds: 0,
          Others: 0,
        };

        existing.TotalSales += t.totalAmount;
        t.items.forEach(item => {
          if (selectedCategory !== 'all' && item.category !== selectedCategory) return;
          if (item.category === 'fertilizers') existing.Fertilizers += item.total;
          else if (item.category === 'pesticides') existing.Pesticides += item.total;
          else if (item.category === 'seeds') existing.Seeds += item.total;
          else existing.Others += item.total;
        });

        map.set(rawDate, existing);
      });

    return Array.from(map.values())
      .sort((a, b) => a.dateStr.localeCompare(b.dateStr));
  }, [transactions, selectedYear, selectedMonth, selectedCategory]);

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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 font-extrabold text-xs uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Sales Analytics & Growth Graphs • बिक्री विश्लेषण</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Monthly & Yearly Sales Performance
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Track category sales distribution for Fertilizers, Pesticides, and Seeds with custom filters.
          </p>
        </div>

        {/* Global Filters */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          
          {/* Exact Date Picker */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-xl text-xs">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span className="text-[10px] text-slate-600 font-bold uppercase hidden sm:inline">Date:</span>
            <input
              type="date"
              value={selectedExactDate}
              onChange={(e) => setSelectedExactDate(e.target.value)}
              className="bg-transparent text-slate-900 font-mono text-xs focus:outline-none cursor-pointer"
            />
          </div>

          {/* Year Selector */}
          <div className="flex items-center space-x-1 bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-[10px] text-slate-600 font-bold uppercase hidden sm:inline">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-white text-slate-900">All Years</option>
              {availableYears.map(yr => (
                <option key={yr} value={yr} className="bg-white text-slate-900">
                  Year {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Month Selector */}
          <div className="flex items-center space-x-1 bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-white text-slate-900">All 12 Months</option>
              {MONTH_NAMES.map((m, idx) => (
                <option key={m} value={idx} className="bg-white text-slate-900">{m}</option>
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
              className="flex items-center space-x-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold px-2.5 py-1.5 rounded-xl text-xs transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Export CSV */}
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Selected Sales */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Sales</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {settings.currencySymbol}{metrics.totalRev.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            From {metrics.count} completed bills ({selectedYear})
          </p>
        </div>

        {/* Fertilizers Revenue */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Fertilizers (खाद)</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {settings.currencySymbol}{metrics.fertRev.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            {metrics.totalRev ? Math.round((metrics.fertRev / metrics.totalRev) * 100) : 0}% of overall sales
          </p>
        </div>

        {/* Pesticides Revenue */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-extrabold text-rose-700 uppercase tracking-wider">Pesticides (कीटनाशक)</span>
            <div className="p-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {settings.currencySymbol}{metrics.pestRev.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            {metrics.totalRev ? Math.round((metrics.pestRev / metrics.totalRev) * 100) : 0}% of overall sales
          </p>
        </div>

        {/* Seeds Revenue */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">Seeds (बीज)</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {settings.currencySymbol}{metrics.seedRev.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            {metrics.totalRev ? Math.round((metrics.seedRev / metrics.totalRev) * 100) : 0}% of overall sales
          </p>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Yearly / Daily Sales Trend Graph */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <span>{chartViewMode === 'daily' ? 'Exact Date Daily Sales Graph' : 'Yearly Monthly Sales Trend'}</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  {chartViewMode === 'daily' ? `${dailyChartData.length} Recorded Date(s)` : `Year ${selectedYear}`}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {chartViewMode === 'daily' 
                  ? 'Day-by-day exact date sales breakdown across Fertilizers, Pesticides, and Seeds'
                  : 'Monthly breakdown across Fertilizers, Pesticides, and Seeds'}
              </p>
            </div>

            {/* View Mode Toggle Switch */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto shrink-0">
              <button
                onClick={() => setChartViewMode('daily')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartViewMode === 'daily' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Exact Date (Daily)
              </button>
              <button
                onClick={() => setChartViewMode('monthly')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartViewMode === 'monthly' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Trend
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartViewMode === 'daily' ? (
                <BarChart data={dailyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
                  <XAxis dataKey="displayDate" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    labelFormatter={(label, items) => {
                      const item = items && items[0] ? items[0].payload : null;
                      return item ? `Exact Date: ${item.dateStr}` : label;
                    }}
                    formatter={(value: any) => [`${settings.currencySymbol}${Number(value).toLocaleString()}`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Fertilizers" stackId="a" fill={CATEGORY_COLORS.fertilizers} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Pesticides" stackId="a" fill={CATEGORY_COLORS.pesticides} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Seeds" stackId="a" fill={CATEGORY_COLORS.seeds} radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <BarChart data={yearlyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value: any) => [`${settings.currencySymbol}${Number(value).toLocaleString()}`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Fertilizers" stackId="a" fill={CATEGORY_COLORS.fertilizers} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Pesticides" stackId="a" fill={CATEGORY_COLORS.pesticides} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Seeds" stackId="a" fill={CATEGORY_COLORS.seeds} radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut Chart */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Category Sales Ratio</h3>
            <p className="text-xs text-slate-500">Revenue split across agri categories</p>
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
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(val: any) => [`${settings.currencySymbol}${Number(val).toLocaleString()}`, 'Sales']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {categoryPieData.map((cat) => (
              <div key={cat.name} className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-700 font-medium text-[11px] truncate">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Products Ranking */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">Top Revenue Generating Products</h3>
          <p className="text-xs text-slate-500">Highest grossing items in {selectedYear}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {topProductsData.map((prod, idx) => (
            <div
              key={prod.name}
              className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-extrabold text-xs">
                  #{idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{prod.name}</h4>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">{prod.category}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-black text-emerald-700 text-xs">
                  {settings.currencySymbol}{prod.totalSales.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500">{prod.qty} units sold</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Transactions & Edit Table for Selected Year */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-emerald-700" />
              <h3 className="font-extrabold text-slate-900 text-base">
                Sales Records & Edit Options ({selectedYear})
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
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
                className="bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            {searchedTransactions.length > 30 && (
              <button
                onClick={() => setShowAllList(!showAllList)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-emerald-800 border border-slate-300 rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
              >
                {showAllList ? 'Show Top 30' : `Show All (${searchedTransactions.length})`}
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Bill No & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedTransactionsList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    No sales records found for Year {selectedYear}.
                  </td>
                </tr>
              ) : (
                displayedTransactionsList.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="font-mono text-emerald-700 font-extrabold">{tx.billNumber}</div>
                      <div className="text-[10px] text-slate-500">{tx.date}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{tx.customerName || 'Walk-in'}</div>
                      <div className="text-[10px] text-slate-500">{tx.customerPhone || ''}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-600 font-medium line-clamp-2">
                        {tx.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[10px] font-bold text-slate-700">
                        {tx.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-black text-emerald-700 text-sm">
                      {settings.currencySymbol}{tx.totalAmount.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      {onOpenEditSaleModal && (
                        <button
                          onClick={() => onOpenEditSaleModal(tx)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-xs font-bold inline-flex items-center space-x-1 transition-colors"
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
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-xs font-bold inline-flex items-center space-x-1 transition-colors"
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
