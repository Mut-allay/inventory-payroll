import { db } from './config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { outletService, Outlet } from './services/outletService';

export const seedDatabase = async () => {
  console.log("🌱 Starting database seeding...");

  // Seed Outlets
  const outlets: Omit<Outlet, 'id' | 'createdAt'>[] = [
    { name: "Lusaka Main Outlet", code: "LUS-001", address: "Plot 123, Lusaka", status: 'active' },
    { name: "Kitwe Outlet", code: "KIT-001", address: "Plot 45, Kitwe", status: 'active' },
    { name: "Ndola Outlet", code: "NDO-001", address: "Industrial Area, Ndola", status: 'active' },
  ];

  for (const outlet of outlets) {
    await outletService.createOutlet(outlet);
  }

  // Seed Stock Items (Global)
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
