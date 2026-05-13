import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGenerateMonthlyPayroll } from '@/hooks/usePayroll';
import { useEmployeesByOutlet } from '@/hooks/useEmployees';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

export default function Payroll() {
  const { userData } = useAuth();
  const { data: employees = [] } = useEmployeesByOutlet();
  const generatePayroll = useGenerateMonthlyPayroll();

  const [selectedMonth, setSelectedMonth] = useState("2026-05");

  const handleGenerate = async () => {
    if (!userData?.outletId) {
      toast.error("No outlet assigned to your account");
      return;
    }
    
    try {
      await generatePayroll.mutateAsync({ outletId: userData.outletId, month: selectedMonth });
      toast.success(`Payroll generated for ${selectedMonth}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to generate payroll");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payroll Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
            <div className="w-full md:w-auto space-y-1.5">
              <label className="text-sm font-medium">Select Month</label>
              <input 
                type="month" 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full border p-2 rounded bg-white dark:bg-slate-950 focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <Button onClick={handleGenerate} size="lg" className="w-full md:w-auto" disabled={generatePayroll.isPending}>
              {generatePayroll.isPending ? "Generating..." : "Generate Payroll for All Employees"}
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Net Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-slate-500">
                      No employees found for this outlet.
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((emp: any) => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-medium">{emp.fullName}</TableCell>
                      <TableCell>{emp.position}</TableCell>
                      <TableCell>ZMW {emp.basicSalary.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-primary">ZMW {emp.basicSalary.toLocaleString()}</TableCell>
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
