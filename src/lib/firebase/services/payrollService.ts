import { db } from '../config';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { employeeService } from './employeeService';

export const payrollService = {
  async generateMonthlyPayroll(outletId: string, month: string) {
    const employees = await employeeService.getEmployeesByOutlet(outletId);

    const batchPromises = employees.map(async (emp) => {
      const record = {
        employeeId: emp.id!,
        outletId,
        month,
        basicSalary: emp.basicSalary,
        allowances: 0,
        deductions: 0,
        netSalary: emp.basicSalary,
        status: 'draft' as const,
        createdAt: Timestamp.now()
      };
      return addDoc(collection(db, 'payroll'), record);
    });

    return Promise.all(batchPromises);
  },

  async updatePayrollRecord(id: string, updates: Partial<any>) {
    const payrollRef = doc(db, 'payroll', id);
    return updateDoc(payrollRef, updates);
  },

  async markAsPaid(id: string, paidBy: string) {
    return updateDoc(doc(db, 'payroll', id), {
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
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
