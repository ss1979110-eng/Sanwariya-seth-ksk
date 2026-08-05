import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Sprout, ShieldAlert, Wheat, Wrench } from 'lucide-react';
import { Product, ProductCategory, AdminSettings } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit?: Product | null;
  settings: AdminSettings;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  settings,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('fertilizers');
  const [unit, setUnit] = useState('50 kg Bag');
  const [rate, setRate] = useState<number | ''>(100);
  const [mrp, setMrp] = useState<number | ''>(120);
  const [stock, setStock] = useState<number | ''>(50);
  const [minStockAlert, setMinStockAlert] = useState<number | ''>(10);
  const [brand, setBrand] = useState('');
  const [chemicalFormula, setChemicalFormula] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setUnit(productToEdit.unit);
      setRate(productToEdit.rate);
      setMrp(productToEdit.mrp || '');
      setStock(productToEdit.stock);
      setMinStockAlert(productToEdit.minStockAlert);
      setBrand(productToEdit.brand || '');
      setChemicalFormula(productToEdit.chemicalFormula || '');
      setDescription(productToEdit.description || '');
    } else {
      setName('');
      setCategory('fertilizers');
      setUnit('50 kg Bag');
      setRate(100);
      setMrp(120);
      setStock(50);
      setMinStockAlert(10);
      setBrand('');
      setChemicalFormula('');
      setDescription('');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updatedProduct: Product = {
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      name: name.trim(),
      category,
      unit: unit.trim() || 'Unit',
      rate: Number(rate) || 0,
      mrp: mrp !== '' ? Number(mrp) : undefined,
      stock: Number(stock) || 0,
      minStockAlert: Number(minStockAlert) || 5,
      brand: brand.trim() || undefined,
      chemicalFormula: chemicalFormula.trim() || undefined,
      description: description.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedProduct);
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
          <Save className="w-5 h-5" />
          <h3 className="text-lg font-extrabold text-slate-900">
            {productToEdit ? 'Edit Product & Rate' : 'Add New Agricultural Product'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Product Category Tabs */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Select Category (श्रेणी)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'fertilizers', label: 'Fertilizers', icon: Sprout },
                { id: 'pesticides', label: 'Pesticides', icon: ShieldAlert },
                { id: 'seeds', label: 'Seeds', icon: Wheat },
                { id: 'other', label: 'Other', icon: Wrench },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as ProductCategory)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border flex items-center justify-center space-x-1 transition-all ${
                      category === item.id
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Neem Coated Urea 50kg"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. IFFCO, Syngenta"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Rate, MRP, Unit */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Selling Rate ({settings.currencySymbol}) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={rate}
                onChange={(e) => setRate(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="266"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-emerald-800 font-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                MRP ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                value={mrp}
                onChange={(e) => setMrp(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="300"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Packaging Unit *
              </label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. 50 kg Bag, 1L"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Stock & Low Stock Alert Level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Current Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="100"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Low Stock Alert Limit
              </label>
              <input
                type="number"
                min="0"
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="15"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Chemical Formula / Specifications */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Chemical Composition / Spec Tag (e.g. N 46% or Chlorpyrifos 20% EC)
            </label>
            <input
              type="text"
              value={chemicalFormula}
              onChange={(e) => setChemicalFormula(e.target.value)}
              placeholder="Nitrogen 46% / Purity 99%"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Description & Dosage Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details regarding crop usage, dosage, and storage guidelines..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Product Rate</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
