import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRecordStockTransaction } from '@/hooks/useStockTransactions';
import { useOutletStock } from '@/hooks/useStock';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function Transactions() {
  const { userData } = useAuth();
  const { data: stockItems = [] } = useOutletStock();
  const recordTransaction = useRecordStockTransaction();

  const [formData, setFormData] = useState({
    itemId: '',
    type: 'IN' as 'IN' | 'OUT' | 'ADJUSTMENT',
    quantity: 0,
    reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemId || formData.quantity <= 0) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await recordTransaction.mutateAsync({
        outletId: userData!.outletId!,
        itemId: formData.itemId,
        type: formData.type,
        quantity: formData.quantity,
        reason: formData.reason,
        performedBy: userData!.uid
      });

      toast.success("Transaction recorded successfully!");
      // Reset form
      setFormData({ itemId: '', type: 'IN', quantity: 0, reason: '' });
    } catch (error: any) {
      toast.error(error.message || "Failed to record transaction");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Stock Transaction Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Stock Item</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, itemId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {stockItems.map((item) => (
                    <SelectItem key={item.itemId} value={item.itemId}>
                      {item.name} ({item.currentBalance} in stock)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'IN' | 'OUT' | 'ADJUSTMENT') => 
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">IN (Receipt)</SelectItem>
                    <SelectItem value="OUT">OUT (Issue)</SelectItem>
                    <SelectItem value="ADJUSTMENT">ADJUSTMENT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Reason / Notes</Label>
              <Textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Optional notes..."
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={recordTransaction.isPending}>
              {recordTransaction.isPending ? "Processing..." : "Record Transaction"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
