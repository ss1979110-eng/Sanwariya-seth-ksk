import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { Product, SaleTransaction, AdminSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_TRANSACTIONS, INITIAL_SETTINGS } from '../data/initialData';

const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: metaEnv.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
  firestoreDatabaseId: metaEnv.VITE_FIREBASE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId,
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Firestore collection names
const COLLECTIONS = {
  PRODUCTS: 'products',
  TRANSACTIONS: 'transactions',
  SETTINGS: 'settings',
};

// Helper to strip undefined values which cause Firestore setDoc errors
function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned as T;
  }
  return data;
}

// Seed initial data if Firestore collections are empty
export async function seedInitialCloudDataIfNeeded() {
  try {
    const productsSnap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
    if (productsSnap.empty) {
      console.log('Seeding initial products to Firestore...');
      const batch = writeBatch(db);
      INITIAL_PRODUCTS.forEach((p) => {
        const ref = doc(db, COLLECTIONS.PRODUCTS, p.id);
        batch.set(ref, sanitizeForFirestore(p));
      });
      await batch.commit();
    }

    const settingsSnap = await getDocs(collection(db, COLLECTIONS.SETTINGS));
    if (settingsSnap.empty) {
      console.log('Seeding initial settings to Firestore...');
      await setDoc(doc(db, COLLECTIONS.SETTINGS, 'global'), sanitizeForFirestore(INITIAL_SETTINGS));
    }

    const transactionsSnap = await getDocs(collection(db, COLLECTIONS.TRANSACTIONS));
    if (transactionsSnap.empty) {
      console.log('Seeding initial transactions to Firestore...');
      // Write transactions in batches of 400
      let batch = writeBatch(db);
      let count = 0;
      for (const tx of INITIAL_TRANSACTIONS) {
        const ref = doc(db, COLLECTIONS.TRANSACTIONS, tx.id);
        batch.set(ref, sanitizeForFirestore(tx));
        count++;
        if (count % 400 === 0) {
          await batch.commit();
          batch = writeBatch(db);
        }
      }
      if (count % 400 !== 0) {
        await batch.commit();
      }
    }
  } catch (err) {
    console.error('Error seeding initial Firestore data:', err);
  }
}

// Real-time Subscriptions
export function subscribeToProducts(
  onData: (products: Product[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = collection(db, COLLECTIONS.PRODUCTS);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Product);
      });
      // Sort products by category or name
      items.sort((a, b) => a.name.localeCompare(b.name));
      onData(items);
    },
    (err) => {
      console.error('Products snapshot error:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToTransactions(
  onData: (transactions: SaleTransaction[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = collection(db, COLLECTIONS.TRANSACTIONS);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: SaleTransaction[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as SaleTransaction);
      });
      // Sort newest date first
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      onData(items);
    },
    (err) => {
      console.error('Transactions snapshot error:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToSettings(
  onData: (settings: AdminSettings) => void,
  onError?: (error: Error) => void
): () => void {
  const docRef = doc(db, COLLECTIONS.SETTINGS, 'global');
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onData(docSnap.data() as AdminSettings);
      } else {
        onData(INITIAL_SETTINGS);
      }
    },
    (err) => {
      console.error('Settings snapshot error:', err);
      if (onError) onError(err);
    }
  );
}

// Write / Update / Delete Cloud Helpers
export async function saveProductToCloud(product: Product): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PRODUCTS, product.id);
  await setDoc(docRef, sanitizeForFirestore(product));
}

export async function deleteProductFromCloud(productId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PRODUCTS, productId);
  await deleteDoc(docRef);
}

export async function saveTransactionToCloud(transaction: SaleTransaction): Promise<void> {
  const docRef = doc(db, COLLECTIONS.TRANSACTIONS, transaction.id);
  await setDoc(docRef, sanitizeForFirestore(transaction));
}

export async function recordSaleWithStockDeductionToCloud(
  transaction: SaleTransaction,
  updatedProducts: Product[]
): Promise<void> {
  const batch = writeBatch(db);

  // 1. Save new transaction
  const txRef = doc(db, COLLECTIONS.TRANSACTIONS, transaction.id);
  batch.set(txRef, sanitizeForFirestore(transaction));

  // 2. Update product stocks
  updatedProducts.forEach((prod) => {
    const prodRef = doc(db, COLLECTIONS.PRODUCTS, prod.id);
    batch.set(prodRef, sanitizeForFirestore(prod));
  });

  await batch.commit();
}

export async function deleteTransactionFromCloud(transactionId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.TRANSACTIONS, transactionId);
  await deleteDoc(docRef);
}

export async function saveSettingsToCloud(settings: AdminSettings): Promise<void> {
  const docRef = doc(db, COLLECTIONS.SETTINGS, 'global');
  await setDoc(docRef, sanitizeForFirestore(settings));
}

export async function resetCloudDataToDemo(): Promise<void> {
  // Clear products, settings, transactions and re-seed
  const productsSnap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
  const pBatch = writeBatch(db);
  productsSnap.forEach((d) => pBatch.delete(d.ref));
  await pBatch.commit();

  const txSnap = await getDocs(collection(db, COLLECTIONS.TRANSACTIONS));
  let tBatch = writeBatch(db);
  let c = 0;
  txSnap.forEach((d) => {
    tBatch.delete(d.ref);
    c++;
    if (c % 400 === 0) {
      tBatch.commit();
      tBatch = writeBatch(db);
    }
  });
  if (c % 400 !== 0) {
    await tBatch.commit();
  }

  await setDoc(doc(db, COLLECTIONS.SETTINGS, 'global'), INITIAL_SETTINGS);

  // Seed fresh
  await seedInitialCloudDataIfNeeded();
}
