import { useState, useEffect } from "react";
import type { Product, Supplier, Sale, StockMovement, Notification } from "@/data/mockData";
import {
  products as mockProducts,
  suppliers as mockSuppliers,
  recentSales as mockSales,
  stockMovements as mockMovements,
  notifications as mockNotifications,
} from "@/data/mockData";
import { db } from "@/lib/firebase";
import {
  onProductsSnapshot, onSuppliersSnapshot, onSalesSnapshot,
  onStockMovementsSnapshot, onNotificationsSnapshot,
} from "@/services/firestore";

const isFirebaseConfigured = (): boolean => {
  try {
    const apiKey = db.app.options.apiKey;
    return !!apiKey && !apiKey.startsWith("YOUR_");
  } catch {
    return false;
  }
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }
    const unsub = onProductsSnapshot((data) => {
      setProducts(data.length > 0 ? data : mockProducts);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { products, loading };
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }
    const unsub = onSuppliersSnapshot((data) => {
      setSuppliers(data.length > 0 ? data : mockSuppliers);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { suppliers, loading };
}

export function useSales() {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }
    const unsub = onSalesSnapshot((data) => {
      setSales(data.length > 0 ? data : mockSales);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { sales, loading };
}

export function useStockMovements() {
  const [movements, setMovements] = useState<StockMovement[]>(mockMovements);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }
    const unsub = onStockMovementsSnapshot((data) => {
      setMovements(data.length > 0 ? data : mockMovements);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { movements, loading };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }
    const unsub = onNotificationsSnapshot((data) => {
      setNotifications(data.length > 0 ? data : mockNotifications);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { notifications, loading };
}
