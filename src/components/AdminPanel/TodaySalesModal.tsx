import React from 'react';
import { X, Calendar, Edit, Trash2, Plus, Receipt, Sparkles, DollarSign } from 'lucide-react';
import { SaleTransaction, AdminSettings } from '../../types';

interface TodaySalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: SaleTransaction[];
  settings: AdminSettings;
  onOpenEditSaleModal: (transaction: SaleTransaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
  onOpenQuickPOS?: () => void;
}

export const TodaySalesModal: React.FC<TodaySalesModalProps> = ({
  isOpen,
  onClose,
  transactions,
  settings,
  onOpenEditSaleModal,
  onDeleteTransaction,
  onOpenQuickPOS,
}) => {
  if (!isOpen) return null;

  // Get current date string formatted as YYYY-MM-DD
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

  // Filter transactions recorded today
  const todayTransactions = transactions.filter(t => t.date === todayStr);
  const todayTotal = todayTransactions.reduce((sum, t) => sum + t.totalAmount, 0);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative space-y-5 my-6 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Today's Sales Manager • आज की बिक्री</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Today's Total Sales ({todayStr})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Admin tool to view, edit, or adjust all sales transactions recorded today.
          </p>
        </div>

        {/* Today's Stats Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center space-x-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Total Today's Sale Revenue</span>
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {settings.currencySymbol}{todayTotal.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Recorded across {todayTransactions.length} bill(s) today
            </div>
          </div>

          {onOpenQuickPOS && (
            <button
              onClick={() => {
                onClose();
                onOpenQuickPOS();
              }}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-950/50 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Today Sale</span>
            </button>
          )}
        </div>

        {/* List of Today's Transactions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>Today's Bill Records ({todayTransactions.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400">Click Edit to modify prices/items</span>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
            {todayTransactions.length === 0 ? (
              <div className="p-8 text-center bg-slate-800/40 border border-slate-800 rounded-2xl">
                <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">
                  No sales recorded yet for today ({todayStr}).
                </p>
                {onOpenQuickPOS && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenQuickPOS();
                    }}
                    className="mt-3 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Make First Sale of Today</span>
                  </button>
                )}
              </div>
            ) : (
              todayTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-slate-800/80 hover:bg-slate-800 p-3.5 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        {tx.billNumber}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {tx.customerName || 'Walk-in Customer'}
                      </span>
                      {tx.customerPhone && (
                        <span className="text-[10px] text-slate-400">({tx.customerPhone})</span>
                      )}
                    </div>
                    
                    <div className="text-xs text-slate-300 font-medium line-clamp-1">
                      {tx.items.map(i => `${i.productName} (${i.quantity} x ${settings.currencySymbol}${i.rate})`).join(', ')}
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                      <span>Payment: <strong className="text-slate-200">{tx.paymentMethod}</strong></span>
                      <span>Items: <strong className="text-slate-200">{tx.items.length}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-3">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-bold">Bill Total</span>
                      <span className="text-base font-black text-emerald-400">
                        {settings.currencySymbol}{tx.totalAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => {
                          onClose();
                          onOpenEditSaleModal(tx);
                        }}
                        className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors"
                        title="Edit Today's Sale"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete sale bill ${tx.billNumber} of ${settings.currencySymbol}${tx.totalAmount}?`)) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        className="px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors"
                        title="Delete Sale"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
