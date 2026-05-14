import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useEmployeesByOutlet, 
  useCreateEmployee, 
  useUpdateEmployee, 
  useDeleteEmployee 
} from '@/hooks/useEmployees';
import { useOutlets } from '@/hooks/useOutlets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, X, Save } from 'lucide-react';

export default function Employees() {
  const { userData } = useAuth();
  const { data: employees = [] } = useEmployeesByOutlet();
  const { data: outlets = [] } = useOutlets();
  
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    employeeNumber: '',
    position: '',
    basicSalary: 0,
    outletId: userData?.outletId || '',
    phone: '',
    email: '',
  });

  const handleReset = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      fullName: '',
      employeeNumber: '',
      position: '',
      basicSalary: 0,
      outletId: userData?.outletId || '',
      phone: '',
      email: '',
    });
  };

  const handleEdit = (emp: any) => {
    setEditingId(emp.id);
    setFormData({
      fullName: emp.fullName,
      employeeNumber: emp.employeeNumber,
      position: emp.position,
      basicSalary: emp.basicSalary,
      outletId: emp.outletId,
      phone: emp.phone || '',
      email: emp.email || '',
    });
    setIsAdding(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateEmployee.mutateAsync({ id: editingId, data: formData });
        toast.success("Employee updated successfully");
      } else {
        await createEmployee.mutateAsync(formData);
        toast.success("Employee added successfully");
      }
      handleReset();
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee.mutateAsync(id);
        toast.success("Employee deleted");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <p className="text-slate-500">Manage staff records and salary details</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Employee
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Employee' : 'New Employee'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    value={formData.fullName} 
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Employee #</Label>
                  <Input 
                    value={formData.employeeNumber} 
                    onChange={(e) => setFormData({...formData, employeeNumber: e.target.value})}
                    placeholder="EMP-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input 
                    value={formData.position} 
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Basic Salary (ZMW)</Label>
                  <Input 
                    type="number"
                    value={formData.basicSalary} 
                    onChange={(e) => setFormData({...formData, basicSalary: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Outlet</Label>
                  <Select 
                    value={formData.outletId} 
                    onValueChange={(val) => setFormData({...formData, outletId: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select outlet" />
                    </SelectTrigger>
                    <SelectContent>
                      {outlets.map((o) => (
                        <SelectItem key={o.id} value={o.id!}>{o.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Phone (Optional)</Label>
                  <Input 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={handleReset}>
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button type="submit" disabled={createEmployee.isPending || updateEmployee.isPending}>
                  <Save className="w-4 h-4 mr-2" /> 
                  {editingId ? 'Update' : 'Save'} Employee
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Outlet</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No employees found.
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{emp.fullName}</p>
                        <p className="text-xs text-slate-500">{emp.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{emp.employeeNumber}</TableCell>
                    <TableCell>{emp.position}</TableCell>
                    <TableCell>
                      {outlets.find(o => o.id === emp.outletId)?.name || emp.outletId}
                    </TableCell>
                    <TableCell>ZMW {emp.basicSalary.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(emp)}>
                          <Pencil className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(emp.id!)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
