import { db } from './config';
import { collection, addDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { outletService } from './services/outletService';
import { Outlet } from '@/types';

export const seedDatabase = async (userId?: string) => {
  console.log("🌱 Starting database seeding...");

  // 1. Bootstrap Admin (if userId provided)
  if (userId) {
    console.log(`👤 Bootstrapping user ${userId} as admin...`);
    await setDoc(doc(db, 'users', userId), {
      uid: userId,
      role: 'admin',
      outletId: null,
      updatedAt: Timestamp.now()
    }, { merge: true });
  }

  // 2. Seed Outlets
  const outlets: Omit<Outlet, 'id' | 'createdAt' | 'status'>[] = [
    { name: "Lusaka Main Outlet", code: "LUS-001", address: "Plot 123, Lusaka" },
    { name: "Kitwe Outlet", code: "KIT-001", address: "Plot 45, Kitwe" },
    { name: "Ndola Outlet", code: "NDO-001", address: "Industrial Area, Ndola" },
  ];

  for (const outlet of outlets) {
    await outletService.createOutlet(outlet);
  }

  // 3. Seed Stock Items (Global)
  const stockItems = [
    { uniqueId: "AGRO-001", name: "D Compound Fertilizer", category: "Fertilizer", unit: "50kg Bag", minStockLevel: 50 },
    { uniqueId: "AGRO-002", name: "Maize Seed (SC 719)", category: "Seed", unit: "10kg Bag", minStockLevel: 30 },
    { uniqueId: "AGRO-003", name: "Glyphosate Herbicide", category: "Chemical", unit: "5L", minStockLevel: 20 },
  ];

  for (const item of stockItems) {
    await addDoc(collection(db, 'stock_items'), {
      ...item,
      createdAt: Timestamp.now()
    });
  }

  console.log("✅ Seeding completed successfully!");
};
