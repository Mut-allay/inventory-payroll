import { db } from '../config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  getDoc,
  Timestamp 
} from 'firebase/firestore';

export interface Outlet {
  id?: string;
  name: string;
  code: string;
  address: string;
  managerId?: string;
  status: 'active' | 'inactive';
  createdAt?: Timestamp;
}

export const outletService = {
  async createOutlet(outlet: Omit<Outlet, 'id' | 'createdAt'>) {
    return addDoc(collection(db, 'outlets'), {
      ...outlet,
      status: 'active',
      createdAt: Timestamp.now()
    });
  },

  async getAllOutlets() {
    const snapshot = await getDocs(collection(db, 'outlets'));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() as Outlet }));
  },

  async getOutletById(id: string) {
    const docRef = doc(db, 'outlets', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() as Outlet } : null;
  },

  async updateOutlet(id: string, data: Partial<Outlet>) {
    const outletRef = doc(db, 'outlets', id);
    return updateDoc(outletRef, data);
  },

  async assignManager(outletId: string, managerUid: string) {
    const outletRef = doc(db, 'outlets', outletId);
    return updateDoc(outletRef, { managerId: managerUid });
  }
};
