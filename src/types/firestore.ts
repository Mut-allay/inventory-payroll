import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'outlet_manager' | 'staff';

export interface Outlet {
  id: string;
  name: string;           // e.g. "Lusaka Main", "Kitwe Outlet"
  code: string;           // e.g. "LUS-01"
  address: string;
  managerId: string;
  createdAt: Timestamp;
}

export interface User {
  uid: string;            // Firebase Auth UID
  email: string;
  displayName: string;
  role: UserRole;
  outletId: string | null;   // null for Admin
  createdAt: Timestamp;
}

export interface StockItem {
  id: string;
  uniqueId: string;       // e.g. "AGRO-FERT-001"
  name: string;
  category: string;
  unit: string;           // "Bags", "Litres", "Kg"
  minStockLevel: number;
  description?: string;
}

export interface OutletStock {
  id: string;
  outletId: string;
  itemId: string;
  name?: string;          // Denormalized for display
  minStockLevel?: number; // Denormalized for display
  openingBalance: number;
  currentBalance: number;
  lastUpdated: Timestamp;
}

export type TransactionType = 'IN' | 'OUT' | 'ADJUSTMENT' | 'RETURN';

export interface StockTransaction {
  id: string;
  outletId: string;
  itemId: string;
  type: TransactionType;
  quantity: number;
  reason?: string;
  performedBy: string;     // uid
  timestamp: Timestamp;
  closingBalance: number;
}

export interface Payroll {
  id: string;
  employeeId: string;
  outletId: string;
  month: string;           // "2026-05"
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'paid';
  paidAt?: Timestamp;
}
