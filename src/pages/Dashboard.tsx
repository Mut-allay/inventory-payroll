import { useAuth } from '@/contexts/AuthContext';
import { useOutletStock, useStockTransactions } from '@/hooks/useStock';
import { LowStockBadge } from '@/components/common/LowStockBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { seedDatabase } from '@/lib/firebase/seed';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function Dashboard() {
  const { userData } = useAuth();
  const { data: stockItems = [] } = useOutletStock();
  const { data: transactions = [] } = useStockTransactions();

  const lowStockItems = stockItems.filter(item => 
    item.currentBalance <= (item.minStockLevel || 0) * 0.8
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {userData?.role === 'admin' ? 'Global Overview' : `${userData?.outletId} Dashboard`}
        </h1>
        <div className="flex items-center gap-4">
          {(userData?.role === 'admin' || !userData?.role) && (
            <Button 
              onClick={async () => {
                if (window.confirm("Seed the database with test data? This will also make you an Admin.")) {
                  try {
                    const { user } = await import('@/lib/firebase/config').then(m => ({ user: m.auth.currentUser }));
                    await seedDatabase(user?.uid);
                    alert("Database seeded successfully! Please refresh to see changes.");
                    window.location.reload();
                  } catch (error: any) {
                    alert("Error: " + error.message);
                  }
                }
              }}
              variant="outline"
              size="sm"
            >
              🌱 {userData?.role ? 'Seed Test Data' : 'First-Time Setup (Seed)'}
            </Button>
          )}
          <Badge variant="outline" className="text-lg px-4 py-2">
            {userData?.role?.toUpperCase() || 'NO ROLE'}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stockItems.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-600">{lowStockItems.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Today's Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {transactions.filter(t => 
                t.timestamp && new Date(t.timestamp?.toDate()).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Items */}
      {lowStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>⚠️ Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Current Balance</TableHead>
                  <TableHead>Min Level</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.currentBalance}</TableCell>
                    <TableCell>{item.minStockLevel}</TableCell>
                    <TableCell>
                      <LowStockBadge 
                        currentBalance={item.currentBalance} 
                        minStockLevel={item.minStockLevel} 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 5).map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell>{t.timestamp ? format(t.timestamp.toDate(), 'MMM dd, HH:mm') : 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={t.type === 'IN' ? 'default' : 'destructive'}>
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{t.quantity}</TableCell>
                  <TableCell>{t.closingBalance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
