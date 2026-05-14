import { db } from '../config';
import { collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { Employee } from '@/types';

export const employeeService = {
  async createEmployee(employee: Omit<Employee, 'id' | 'joinedDate' | 'status'>) {
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
  },

  async updateEmployee(id: string, data: Partial<Employee>) {
    const employeeRef = doc(db, 'employees', id);
    return updateDoc(employeeRef, data);
  },

  async deleteEmployee(id: string) {
    const employeeRef = doc(db, 'employees', id);
    return deleteDoc(employeeRef);
  }
};
