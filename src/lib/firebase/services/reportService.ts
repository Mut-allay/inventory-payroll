import { db } from '../config';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

export interface StockMovementSummary {
  itemId: string;
  itemName?: string;
  totalIn: number;
  totalOut: number;
  netChange: number;
  transactions: any[];
}

export interface PayrollSummary {
  month: string;
  totalBasic: number;
  totalAllowances: number;
  totalDeductions: number;
  totalNet: number;
  employeeCount: number;
  records: any[];
}

export const reportService = {
  async getStockMovementReport(outletId: string, startDate: Date, endDate: Date) {
    const q = query(
      collection(db, 'stock_transactions'),
      where('outletId', '==', outletId),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate)),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Calculate summaries by itemId
    const summaryMap = new Map<string, StockMovementSummary>();

    transactions.forEach((tx: any) => {
      if (!summaryMap.has(tx.itemId)) {
        summaryMap.set(tx.itemId, {
          itemId: tx.itemId,
          totalIn: 0,
          totalOut: 0,
          netChange: 0,
          transactions: []
        });
      }
      const summary = summaryMap.get(tx.itemId)!;
      summary.transactions.push(tx);
      
      if (tx.type === 'IN' || (tx.type === 'ADJUSTMENT' && tx.quantity > 0)) {
        summary.totalIn += Math.abs(tx.quantity);
      } else if (tx.type === 'OUT' || (tx.type === 'ADJUSTMENT' && tx.quantity < 0)) {
        summary.totalOut += Math.abs(tx.quantity);
      }
      summary.netChange = summary.totalIn - summary.totalOut;
    });

    return Array.from(summaryMap.values());
  },

  async getClosingStockReport(outletId: string) {
    const q = query(
      collection(db, 'outlet_stock'),
      where('outletId', '==', outletId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getPayrollSummaryReport(outletId: string, month: string): Promise<PayrollSummary> {
    const q = query(
      collection(db, 'payroll'),
      where('outletId', '==', outletId),
      where('month', '==', month)
    );
    const snapshot = await getDocs(q);
    const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const summary: PayrollSummary = {
      month,
      totalBasic: 0,
      totalAllowances: 0,
      totalDeductions: 0,
      totalNet: 0,
      employeeCount: records.length,
      records
    };

    records.forEach((r: any) => {
      summary.totalBasic += r.basicSalary || 0;
      summary.totalAllowances += r.allowances || 0;
      summary.totalDeductions += r.deductions || 0;
      summary.totalNet += r.netSalary || 0;
    });

    return summary;
  }
};
