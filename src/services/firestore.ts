import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, onSnapshot, writeBatch, Timestamp,
  type QueryConstraint, type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product, Supplier, Sale, StockMovement, Notification } from "@/data/mockData";

// Collection references
const COLLECTIONS = {
  products: "products",
  suppliers: "suppliers",
  sales: "sales",
  stockMovements: "stock_movements",
  notifications: "notifications",
} as const;

// ─── Products ────────────────────────────────────────────
export const productsRef = collection(db, COLLECTIONS.products);

export async function getProducts(): Promise<Product[]> {
  const snap = await getDocs(query(productsRef, orderBy("name")));
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Product);
}

export async function addProduct(product: Omit<Product, "id">): Promise<string> {
  const docRef = await addDoc(productsRef, { ...product, lastUpdated: new Date().toISOString().split("T")[0] });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.products, id), { ...data, lastUpdated: new Date().toISOString().split("T")[0] });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.products, id));
}

export async function deleteProducts(ids: string[]): Promise<void> {
  const batch = writeBatch(db);
  ids.forEach((id) => batch.delete(doc(db, COLLECTIONS.products, id)));
  await batch.commit();
}

// ─── Suppliers ───────────────────────────────────────────
export const suppliersRef = collection(db, COLLECTIONS.suppliers);

export async function getSuppliers(): Promise<Supplier[]> {
  const snap = await getDocs(query(suppliersRef, orderBy("name")));
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Supplier);
}

export async function addSupplier(supplier: Omit<Supplier, "id">): Promise<string> {
  const docRef = await addDoc(suppliersRef, supplier);
  return docRef.id;
}

export async function updateSupplier(id: string, data: Partial<Supplier>): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.suppliers, id), data);
}

export async function deleteSupplier(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.suppliers, id));
}

// ─── Sales ───────────────────────────────────────────────
export const salesRef = collection(db, COLLECTIONS.sales);

export async function getSales(): Promise<Sale[]> {
  const snap = await getDocs(query(salesRef, orderBy("date", "desc")));
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Sale);
}

export async function addSale(sale: Omit<Sale, "id">): Promise<string> {
  const docRef = await addDoc(salesRef, sale);
  return docRef.id;
}

// ─── Stock Movements ─────────────────────────────────────
export const stockMovementsRef = collection(db, COLLECTIONS.stockMovements);

export async function getStockMovements(): Promise<StockMovement[]> {
  const snap = await getDocs(query(stockMovementsRef, orderBy("date", "desc")));
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as StockMovement);
}

export async function addStockMovement(movement: Omit<StockMovement, "id">): Promise<string> {
  const docRef = await addDoc(stockMovementsRef, movement);
  return docRef.id;
}

// ─── Notifications ───────────────────────────────────────
export const notificationsRef = collection(db, COLLECTIONS.notifications);

export async function getNotifications(): Promise<Notification[]> {
  const snap = await getDocs(notificationsRef);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Notification);
}

export async function markNotificationRead(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.notifications, id), { read: true });
}

export async function markAllNotificationsRead(): Promise<void> {
  const snap = await getDocs(query(notificationsRef, where("read", "==", false)));
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.update(d.ref, { read: true }));
  await batch.commit();
}

// ─── Real-time listeners ────────────────────────────────
export function onProductsSnapshot(callback: (products: Product[]) => void) {
  return onSnapshot(query(productsRef, orderBy("name")), (snap) => {
    callback(snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Product));
  });
}

export function onSuppliersSnapshot(callback: (suppliers: Supplier[]) => void) {
  return onSnapshot(query(suppliersRef, orderBy("name")), (snap) => {
    callback(snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Supplier));
  });
}

export function onSalesSnapshot(callback: (sales: Sale[]) => void) {
  return onSnapshot(query(salesRef, orderBy("date", "desc")), (snap) => {
    callback(snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Sale));
  });
}

export function onStockMovementsSnapshot(callback: (movements: StockMovement[]) => void) {
  return onSnapshot(query(stockMovementsRef, orderBy("date", "desc")), (snap) => {
    callback(snap.docs.map((d) => ({ ...d.data(), id: d.id }) as StockMovement));
  });
}

export function onNotificationsSnapshot(callback: (notifications: Notification[]) => void) {
  return onSnapshot(notificationsRef, (snap) => {
    callback(snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Notification));
  });
}

// ─── Seed Firestore with mock data ──────────────────────
import {
  products as mockProducts,
  suppliers as mockSuppliers,
  recentSales as mockSales,
  stockMovements as mockMovements,
  notifications as mockNotifications,
} from "@/data/mockData";

export async function seedFirestore(): Promise<void> {
  const batch = writeBatch(db);

  // Check if already seeded
  const existingProducts = await getDocs(productsRef);
  if (!existingProducts.empty) {
    throw new Error("Firestore already has data. Clear collections first to re-seed.");
  }

  for (const p of mockProducts) {
    const { id, ...data } = p;
    batch.set(doc(db, COLLECTIONS.products, id), data);
  }
  for (const s of mockSuppliers) {
    const { id, ...data } = s;
    batch.set(doc(db, COLLECTIONS.suppliers, id), data);
  }
  for (const sale of mockSales) {
    const { id, ...data } = sale;
    batch.set(doc(db, COLLECTIONS.sales, id), data);
  }
  for (const m of mockMovements) {
    const { id, ...data } = m;
    batch.set(doc(db, COLLECTIONS.stockMovements, id), data);
  }
  for (const n of mockNotifications) {
    const { id, ...data } = n;
    batch.set(doc(db, COLLECTIONS.notifications, id), data);
  }

  await batch.commit();
}
