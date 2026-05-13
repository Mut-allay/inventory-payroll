import { db } from '../config';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { employeeService } from './employeeService';

export interface PayrollRecord {
  id?: string;
  employeeId: string;
  outletId: string;
  month: string;                    // YYYY-MM
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'draft' | 'approved' | 'paid';
  paidAt?: Timestamp;
  paidBy?: string;
  notes?: string;
  createdAt?: Timestamp;
}

export const payrollService = {
  async createPayrollRecord(record: Omit<PayrollRecord, 'id' | 'netSalary'>) {
    const netSalary = record.basicSalary + record.allowances - record.deductions;

    const docRef = await addDoc(collection(db, 'payroll'), {
      ...record,
      netSalary,
      status: 'draft',
      createdAt: Timestamp.now()
    });

    return { id: docRef.id, ...record, netSalary };
  },

  async generateMonthlyPayroll(outletId: string, month: string) {  // month = "2026-05"
    // Get employees for this outlet
    const employees = await employeeService.getEmployeesByOutlet(outletId);

    const payrollRecords = [];

    for (const emp of employees) {
      const record = {
        employeeId: emp.id!,
        outletId,
        month,
        basicSalary: emp.basicSalary,
        allowances: 0,
        deductions: 0,
        netSalary: emp.basicSalary,
        status: 'draft' as const,
      };

      const docRef = await addDoc(collection(db, 'payroll'), {
        ...record,
        createdAt: Timestamp.now()
      });

      payrollRecords.push({ id: docRef.id, ...record });
    }

    return payrollRecords;
  },

  async markAsPaid(payrollId: string, paidBy: string) {
    const payrollRef = doc(db, 'payroll', payrollId);
    return updateDoc(payrollRef, {
      status: 'paid',
      paidAt: Timestamp.now(),
      paidBy
    });
  },

  async getPayrollByOutlet(outletId: string, month?: string) {
    let q = query(
      collection(db, 'payroll'),
      where('outletId', '==', outletId)
    );

    if (month) {
      q = query(q, where('month', '==', month));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PayrollRecord[];
  }
};
