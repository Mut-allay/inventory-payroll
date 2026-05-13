import { useOutlets, useCreateOutlet } from '@/hooks/useOutlets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Outlets() {
  const { data: outlets = [] } = useOutlets();
  const createOutlet = useCreateOutlet();
  const [newOutlet, setNewOutlet] = useState({ name: '', code: '', address: '' });

  const handleCreate = async () => {
    if (!newOutlet.name || !newOutlet.code) return toast.error("Name and Code are required");
    
    try {
      await createOutlet.mutateAsync(newOutlet);
      setNewOutlet({ name: '', code: '', address: '' });
      toast.success("Outlet created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create outlet");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Outlet Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Create Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <input 
              placeholder="Outlet Name" 
              value={newOutlet.name} 
              onChange={(e) => setNewOutlet({...newOutlet, name: e.target.value})} 
              className="border p-2 rounded focus:ring-1 focus:ring-primary outline-none" 
            />
            <input 
              placeholder="Code (e.g. LUS-001)" 
              value={newOutlet.code} 
              onChange={(e) => setNewOutlet({...newOutlet, code: e.target.value})} 
              className="border p-2 rounded focus:ring-1 focus:ring-primary outline-none" 
            />
            <input 
              placeholder="Address" 
              value={newOutlet.address} 
              onChange={(e) => setNewOutlet({...newOutlet, address: e.target.value})} 
              className="border p-2 rounded focus:ring-1 focus:ring-primary outline-none" 
            />
            <Button onClick={handleCreate} className="col-span-1 md:col-span-3">Create New Outlet</Button>
          </div>

          {/* Outlets Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outlets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-slate-500">
                      No outlets found.
                    </TableCell>
                  </TableRow>
                ) : (
                  outlets.map((outlet) => (
                    <TableRow key={outlet.id}>
                      <TableCell className="font-medium">{outlet.name}</TableCell>
                      <TableCell>{outlet.code}</TableCell>
                      <TableCell>{outlet.address}</TableCell>
                      <TableCell>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
