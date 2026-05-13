import { Badge } from "@/components/ui/badge";

type StockLevel = 'high' | 'medium' | 'low';

const getStockLevel = (current: number, minLevel: number): StockLevel => {
  if (current >= minLevel * 1.5) return 'high';
  if (current >= minLevel) return 'medium';
  return 'low';
};

export const LowStockBadge = ({ currentBalance, minStockLevel }: { 
  currentBalance: number; 
  minStockLevel: number;
}) => {
  const level = getStockLevel(currentBalance, minStockLevel);

  const colors = {
    high: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <Badge className={colors[level]} variant="outline">
      {level === 'low' ? '⚠️ Low Stock' : level === 'medium' ? '⚡ Medium' : '✅ Good'}
    </Badge>
  );
};
