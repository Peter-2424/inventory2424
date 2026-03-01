export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  quantity: number;
  minStock: number;
  supplier: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
  lastUpdated: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  productsCount: number;
  lastDelivery: string;
  status: "active" | "inactive";
}

export interface Sale {
  id: string;
  date: string;
  items: number;
  total: number;
  paymentMethod: string;
  cashier: string;
  status: "completed" | "refunded" | "pending";
}

export interface StockMovement {
  id: string;
  productName: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  date: string;
  note: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "warning" | "info" | "error" | "success";
  time: string;
  read: boolean;
}

export const products: Product[] = [
  { id: "P001", name: "Premium Cement (50kg)", sku: "CEM-001", category: "Building Materials", price: 4500, costPrice: 3800, quantity: 245, minStock: 50, supplier: "Dangote Industries", status: "in-stock", lastUpdated: "2025-02-25" },
  { id: "P002", name: "Roofing Sheet (0.5mm)", sku: "ROF-002", category: "Roofing", price: 6200, costPrice: 5100, quantity: 18, minStock: 20, supplier: "Aluminum Corp", status: "low-stock", lastUpdated: "2025-02-24" },
  { id: "P003", name: "PVC Pipe 4inch", sku: "PVC-003", category: "Plumbing", price: 3200, costPrice: 2600, quantity: 0, minStock: 30, supplier: "PlumbTech Ltd", status: "out-of-stock", lastUpdated: "2025-02-23" },
  { id: "P004", name: "Emulsion Paint (20L)", sku: "PNT-004", category: "Paints", price: 18500, costPrice: 14200, quantity: 67, minStock: 15, supplier: "ColorMax Paints", status: "in-stock", lastUpdated: "2025-02-25" },
  { id: "P005", name: "Iron Rod 12mm", sku: "IRN-005", category: "Building Materials", price: 5800, costPrice: 4900, quantity: 320, minStock: 100, supplier: "SteelWorks Nigeria", status: "in-stock", lastUpdated: "2025-02-24" },
  { id: "P006", name: "Door Lock Set", sku: "LCK-006", category: "Hardware", price: 8500, costPrice: 6200, quantity: 12, minStock: 15, supplier: "SecureLock Co", status: "low-stock", lastUpdated: "2025-02-22" },
  { id: "P007", name: "Electrical Wire (100m)", sku: "ELW-007", category: "Electrical", price: 22000, costPrice: 17500, quantity: 45, minStock: 10, supplier: "PowerLine Ltd", status: "in-stock", lastUpdated: "2025-02-25" },
  { id: "P008", name: "Ceramic Tiles (60x60)", sku: "TIL-008", category: "Flooring", price: 3800, costPrice: 2900, quantity: 5, minStock: 25, supplier: "TileWorld", status: "low-stock", lastUpdated: "2025-02-21" },
  { id: "P009", name: "Granite Tiles (40x40)", sku: "TIL-009", category: "Flooring", price: 4200, costPrice: 3400, quantity: 78, minStock: 20, supplier: "TileWorld", status: "in-stock", lastUpdated: "2025-02-25" },
  { id: "P010", name: "POP Ceiling Board", sku: "POP-010", category: "Building Materials", price: 2800, costPrice: 2100, quantity: 0, minStock: 40, supplier: "Dangote Industries", status: "out-of-stock", lastUpdated: "2025-02-20" },
  { id: "P011", name: "Water Pump 1.5HP", sku: "PMP-011", category: "Plumbing", price: 45000, costPrice: 35000, quantity: 8, minStock: 5, supplier: "PlumbTech Ltd", status: "in-stock", lastUpdated: "2025-02-24" },
  { id: "P012", name: "MCB Circuit Breaker", sku: "ELW-012", category: "Electrical", price: 3500, costPrice: 2200, quantity: 3, minStock: 10, supplier: "PowerLine Ltd", status: "low-stock", lastUpdated: "2025-02-23" },
];

export const suppliers: Supplier[] = [
  { id: "S001", name: "Dangote Industries", email: "supply@dangote.com", phone: "+234 801 234 5678", address: "Lagos, Nigeria", productsCount: 12, lastDelivery: "2025-02-20", status: "active" },
  { id: "S002", name: "Aluminum Corp", email: "orders@alumcorp.com", phone: "+234 802 345 6789", address: "Ogun State, Nigeria", productsCount: 8, lastDelivery: "2025-02-18", status: "active" },
  { id: "S003", name: "PlumbTech Ltd", email: "sales@plumbtech.com", phone: "+234 803 456 7890", address: "Abuja, Nigeria", productsCount: 15, lastDelivery: "2025-01-30", status: "inactive" },
  { id: "S004", name: "ColorMax Paints", email: "info@colormax.com", phone: "+234 804 567 8901", address: "Lagos, Nigeria", productsCount: 20, lastDelivery: "2025-02-22", status: "active" },
  { id: "S005", name: "SteelWorks Nigeria", email: "orders@steelworks.ng", phone: "+234 805 678 9012", address: "Port Harcourt, Nigeria", productsCount: 6, lastDelivery: "2025-02-24", status: "active" },
  { id: "S006", name: "SecureLock Co", email: "info@securelock.ng", phone: "+234 806 789 0123", address: "Lagos, Nigeria", productsCount: 4, lastDelivery: "2025-02-15", status: "active" },
  { id: "S007", name: "PowerLine Ltd", email: "sales@powerline.ng", phone: "+234 807 890 1234", address: "Kano, Nigeria", productsCount: 9, lastDelivery: "2025-02-23", status: "active" },
  { id: "S008", name: "TileWorld", email: "orders@tileworld.ng", phone: "+234 808 901 2345", address: "Ibadan, Nigeria", productsCount: 11, lastDelivery: "2025-02-21", status: "inactive" },
];

export const recentSales: Sale[] = [
  { id: "TXN-001", date: "2025-02-25 14:32", items: 3, total: 28500, paymentMethod: "Cash", cashier: "Adebayo O.", status: "completed" },
  { id: "TXN-002", date: "2025-02-25 13:15", items: 1, total: 6200, paymentMethod: "Transfer", cashier: "Fatima A.", status: "completed" },
  { id: "TXN-003", date: "2025-02-25 11:45", items: 5, total: 52300, paymentMethod: "Cash", cashier: "Adebayo O.", status: "completed" },
  { id: "TXN-004", date: "2025-02-25 10:20", items: 2, total: 14700, paymentMethod: "POS", cashier: "Chidi N.", status: "refunded" },
  { id: "TXN-005", date: "2025-02-24 16:50", items: 4, total: 35800, paymentMethod: "Cash", cashier: "Fatima A.", status: "completed" },
  { id: "TXN-006", date: "2025-02-24 14:10", items: 2, total: 12400, paymentMethod: "Transfer", cashier: "Adebayo O.", status: "completed" },
  { id: "TXN-007", date: "2025-02-24 09:30", items: 1, total: 45000, paymentMethod: "POS", cashier: "Chidi N.", status: "pending" },
  { id: "TXN-008", date: "2025-02-23 17:20", items: 6, total: 78500, paymentMethod: "Cash", cashier: "Fatima A.", status: "completed" },
];

export const stockMovements: StockMovement[] = [
  { id: "SM-001", productName: "Premium Cement (50kg)", type: "in", quantity: 100, date: "2025-02-25", note: "Delivery from Dangote" },
  { id: "SM-002", productName: "Roofing Sheet (0.5mm)", type: "out", quantity: 5, date: "2025-02-25", note: "Sale TXN-001" },
  { id: "SM-003", productName: "Iron Rod 12mm", type: "in", quantity: 200, date: "2025-02-24", note: "Restocking" },
  { id: "SM-004", productName: "Emulsion Paint (20L)", type: "adjustment", quantity: -3, date: "2025-02-24", note: "Damaged goods" },
  { id: "SM-005", productName: "PVC Pipe 4inch", type: "out", quantity: 15, date: "2025-02-23", note: "Bulk order" },
  { id: "SM-006", productName: "Door Lock Set", type: "in", quantity: 20, date: "2025-02-22", note: "New batch received" },
  { id: "SM-007", productName: "Ceramic Tiles (60x60)", type: "out", quantity: 30, date: "2025-02-21", note: "Sale TXN-005" },
  { id: "SM-008", productName: "Electrical Wire (100m)", type: "adjustment", quantity: -2, date: "2025-02-20", note: "Inventory count correction" },
];

export const notifications: Notification[] = [
  { id: "N001", title: "Low Stock Alert", message: "Roofing Sheet (0.5mm) is below minimum stock level", type: "warning", time: "5 min ago", read: false },
  { id: "N002", title: "Out of Stock", message: "PVC Pipe 4inch is out of stock. Reorder immediately.", type: "error", time: "1 hour ago", read: false },
  { id: "N003", title: "New Delivery", message: "100 units of Premium Cement received from Dangote Industries", type: "success", time: "3 hours ago", read: false },
  { id: "N004", title: "Sale Completed", message: "Transaction TXN-003 completed — ₦52,300", type: "info", time: "5 hours ago", read: true },
  { id: "N005", title: "Low Stock Alert", message: "MCB Circuit Breaker is below minimum stock level", type: "warning", time: "1 day ago", read: true },
];

export const dailySalesData = [
  { day: "Mon", sales: 125000 },
  { day: "Tue", sales: 98000 },
  { day: "Wed", sales: 145000 },
  { day: "Thu", sales: 112000 },
  { day: "Fri", sales: 178000 },
  { day: "Sat", sales: 210000 },
  { day: "Sun", sales: 65000 },
];

export const categorySalesData = [
  { name: "Building Materials", value: 45 },
  { name: "Roofing", value: 15 },
  { name: "Plumbing", value: 12 },
  { name: "Paints", value: 18 },
  { name: "Electrical", value: 10 },
];
