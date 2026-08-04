import { Product, SaleTransaction, AdminSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_TRANSACTIONS, INITIAL_SETTINGS } from '../data/initialData';

const KEYS = {
  PRODUCTS: 'agri_shop_products_v1',
  TRANSACTIONS: 'agri_shop_transactions_v1',
  SETTINGS: 'agri_shop_settings_v1',
  ADMIN_AUTH: 'agri_shop_admin_authed_v1',
};

export const getStoredProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading stored products:', err);
    return INITIAL_PRODUCTS;
  }
};

export const saveStoredProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  } catch (err) {
    console.error('Error saving products:', err);
  }
};

export const getStoredTransactions = (): SaleTransaction[] => {
  try {
    const data = localStorage.getItem(KEYS.TRANSACTIONS);
    if (!data) {
      localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading stored transactions:', err);
    return INITIAL_TRANSACTIONS;
  }
};

export const saveStoredTransactions = (transactions: SaleTransaction[]): void => {
  try {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (err) {
    console.error('Error saving transactions:', err);
  }
};

export const getStoredSettings = (): AdminSettings => {
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading settings:', err);
    return INITIAL_SETTINGS;
  }
};

export const saveStoredSettings = (settings: AdminSettings): void => {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings:', err);
  }
};

export const getAdminAuthStatus = (): boolean => {
  try {
    return localStorage.getItem(KEYS.ADMIN_AUTH) === 'true';
  } catch {
    return false;
  }
};

export const setAdminAuthStatus = (authed: boolean): void => {
  try {
    if (authed) {
      localStorage.setItem(KEYS.ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(KEYS.ADMIN_AUTH);
    }
  } catch (err) {
    console.error('Error setting auth state:', err);
  }
};

export const resetToDemoData = (): void => {
  try {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  } catch (err) {
    console.error('Error resetting demo data:', err);
  }
};
