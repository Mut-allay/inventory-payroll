import { db } from '../config';
import { 
  collection, 
  doc, 
  Timestamp,
  runTransaction 
} from 'firebase/firestore';

export interface StockTransactionInput {
  outletId: string;
  itemId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason?: string;
  performedBy: string;
}

export const stockService = {
  async recordTransaction(input: StockTransactionInput) {
    const { outletId, itemId, type, quantity, reason, performedBy } = input;

    return runTransaction(db, async (transaction) => {
      const stockDocRef = doc(db, 'outlet_stock', `${outletId}_${itemId}`);
      const stockSnap = await transaction.get(stockDocRef);

      let currentBalance = 0;

      if (stockSnap.exists()) {
        const data = stockSnap.data();
        currentBalance = data.currentBalance || 0;
      }

      // Calculate new balance
      let newBalance = currentBalance;
      if (type === 'IN' || type === 'ADJUSTMENT') newBalance += quantity;
      else if (type === 'OUT') newBalance -= quantity;

      // Prevent negative stock (optional strict rule)
      if (newBalance < 0 && type === 'OUT') {
        throw new Error("Insufficient stock for this OUT transaction");
      }

      // Update or create outlet_stock record
      if (stockSnap.exists()) {
        transaction.update(stockDocRef, {
          currentBalance: newBalance,
          lastUpdated: Timestamp.now()
        });
      } else {
        transaction.set(stockDocRef, {
          outletId,
          itemId,
          openingBalance: newBalance,
          currentBalance: newBalance,
          lastUpdated: Timestamp.now()
        });
      }

      // Log transaction
      const txRef = doc(collection(db, 'stock_transactions'));
      transaction.set(txRef, {
        outletId,
        itemId,
        type,
        quantity,
        reason: reason || '',
        performedBy,
        previousBalance: currentBalance,
        closingBalance: newBalance,
        timestamp: Timestamp.now()
      });

      return { newBalance, previousBalance: currentBalance };
    });
  }
};

// Also keep a standalone export if needed by existing code
export const recordTransaction = stockService.recordTransaction;
