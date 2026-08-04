export type ProductCategory = 'fertilizers' | 'pesticides' | 'seeds' | 'other';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit: string; // e.g. '50 kg Bag', '1 Liter Bottle', '1 kg Packet', '10 kg Bag'
  rate: number; // Price per unit
  mrp?: number; // Maximum Retail Price for discount display
  stock: number;
  minStockAlert: number;
  description?: string;
  chemicalFormula?: string; // e.g. N-P-K 19:19:19 or Chlorpyrifos 20% EC
  brand?: string;
  updatedAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  category: ProductCategory;
  unit: string;
  rate: number;
  quantity: number;
  total: number;
}

export interface SaleTransaction {
  id: string;
  billNumber: string;
  customerName?: string;
  customerPhone?: string;
  date: string; // YYYY-MM-DD format
  month: string; // YYYY-MM format for fast grouping
  year: number; // YYYY for fast grouping
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Credit' | 'Bank Transfer';
  notes?: string;
}

export interface AdminSettings {
  adminPin: string;
  shopName: string;
  tagline: string;
  phone: string;
  address: string;
  currencySymbol: string;
  lowStockThreshold: number;
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  description: string;
  iconName: string;
  color: string;
  badgeBg: string;
}
