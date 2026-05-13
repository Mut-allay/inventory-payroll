import { db } from '../config';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

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

export const employeeService = {
  async createEmployee(employee: Omit<Employee, 'id' | 'joinedDate'>) {
    return addDoc(collection(db, 'employees'), {
      ...employee,
      status: 'active',
      joinedDate: Timestamp.now()
    });
  },

  async getEmployeesByOutlet(outletId: string) {
    const q = query(collection(db, 'employees'), where('outletId', '==', outletId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() as Employee }));
  },

  async getAllEmployees() {
    const snapshot = await getDocs(collection(db, 'employees'));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() as Employee }));
  }
};
