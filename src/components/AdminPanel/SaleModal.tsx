import React, { useState, useEffect } from 'react';
import { X, Save, Edit, Trash2 } from 'lucide-react';
import { SaleTransaction, SaleItem, AdminSettings } from '../../types';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: SaleTransaction) => void;
  saleToEdit: SaleTransaction | null;
  settings: AdminSettings;
}

export const SaleModal: React.FC<SaleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  saleToEdit,
  settings,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Credit' | 'Bank Transfer'>('Cash');
  const [items, setItems] = useState<SaleItem[]>([]);

  useEffect(() => {
    if (saleToEdit) {
      setCustomerName(saleToEdit.customerName || '');
      setCustomerPhone(saleToEdit.customerPhone || '');
      setDate(saleToEdit.date);
      setPaymentMethod(saleToEdit.paymentMethod);
      setItems(saleToEdit.items);
    }
  }, [saleToEdit, isOpen]);

  if (!isOpen || !saleToEdit) return null;

  const updateItemQty = (index: number, newQty: number) => {
    if (newQty <= 0) return;
    setItems(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, quantity: newQty, total: newQty * item.rate };
      }
      return item;
    }));
  };

  const updateItemRate = (index: number, newRate: number) => {
    if (newRate < 0) return;
    setItems(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, rate: newRate, total: item.quantity * newRate };
      }
      return item;
    }));
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const [yearStr, monthStr] = date.split('-');
    const yearNum = parseInt(yearStr, 10) || saleToEdit.year;
    const monthKey = `${yearStr}-${monthStr}`;

    const updatedTx: SaleTransaction = {
      ...saleToEdit,
      customerName: customerName.trim() || 'Walk-in Customer',
      customerPhone: customerPhone.trim() || 'N/A',
      date,
      month: monthKey,
      year: yearNum,
      paymentMethod,
      items,
      totalAmount,
    };

    onSave(updatedTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-emerald-700">
          <Edit className="w-5 h-5" />
          <h3 className="text-lg font-extrabold text-slate-900">
            Edit Sale Transaction ({saleToEdit.billNumber})
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-600 block mb-1">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">Customer Phone</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-600 block mb-1">Transaction Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Credit">Credit</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <label className="font-bold text-slate-800 block">Sale Items & Rates</label>
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 gap-2">
                <div className="flex-1">
                  <div className="font-bold text-slate-900">{item.productName}</div>
                  <div className="text-[10px] text-slate-500 uppercase">{item.category}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Qty</span>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItemQty(idx, Number(e.target.value))}
                      className="w-14 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-center text-slate-900"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">Rate</span>
                    <input
                      type="number"
                      min="0"
                      value={item.rate}
                      onChange={(e) => updateItemRate(idx, Number(e.target.value))}
                      className="w-16 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-center text-emerald-800 font-bold"
                    />
                  </div>

                  <span className="font-bold text-emerald-700 w-16 text-right">
                    {settings.currencySymbol}{item.total}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/80">
            <span className="font-bold text-slate-700">Updated Total Amount:</span>
            <span className="text-xl font-extrabold text-emerald-800">
              {settings.currencySymbol}{totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={items.length === 0}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold flex items-center justify-center space-x-1 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Update Sale</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
