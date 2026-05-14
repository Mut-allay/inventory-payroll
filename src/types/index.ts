import { Timestamp } from 'firebase/firestore';

export interface UserData {
  uid: string;
  email: string;
  role: 'admin' | 'outlet_manager' | 'staff';
  outletId: string | null;
  fullName?: string;
  createdAt?: Timestamp;
}

export interface Outlet {
  id?: string;
  name: string;
  code: string;
  address: string;
  managerId?: string;
  status: 'active' | 'inactive';
  createdAt?: Timestamp;
}

export interface StockItem {
  id?: string;
  uniqueId: string;
  name: string;
  category: string;
  unit: string;
  minStockLevel: number;
  createdAt?: Timestamp;
}

export interface OutletStock {
  id?: string;
  outletId: string;
  itemId: string;
  name: string;
  currentBalance: number;
  minStockLevel: number;
  lastUpdated: Timestamp;
}

export interface StockTransaction {
  id?: string;
  outletId: string;
  itemId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason?: string;
  performedBy: string;
  timestamp: Timestamp;
  previousBalance: number;
  closingBalance: number;
}

export interface Employee {
  id?: string;
  employeeNumber: string;
  fullName: string;
  outletId: string;
  position: string;
  basicSalary: number;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive';
  joinedDate: Timestamp;
}

export interface PayrollRecord {
  id?: string;
  employeeId: string;
  outletId: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'draft' | 'paid';
  paidAt?: Timestamp;
  paidBy?: string;
  createdAt?: Timestamp;
}
