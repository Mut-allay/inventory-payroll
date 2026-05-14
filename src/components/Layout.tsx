import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Users, 
  Store, 
  CreditCard, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active: boolean;
  collapsed: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active, collapsed }: SidebarItemProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
      active 
        ? "bg-primary text-primary-foreground shadow-sm" 
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "" : "text-slate-500 group-hover:text-slate-900")} />
    {!collapsed && <span className="font-medium text-sm">{label}</span>}
  </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', roles: ['admin', 'outlet_manager', 'staff'] },
    { icon: ArrowLeftRight, label: 'Transactions', href: '/transactions', roles: ['admin', 'outlet_manager', 'staff'] },
    { icon: CreditCard, label: 'Payroll', href: '/payroll', roles: ['admin', 'outlet_manager'] },
    { icon: Users, label: 'Employees', href: '/employees', roles: ['admin', 'outlet_manager'] },
    { icon: Store, label: 'Outlets', href: '/admin/outlets', roles: ['admin'] },
  ];

  const filteredItems = navItems.filter(item => 
    !userData || item.roles.includes(userData.role)
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-50",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            {!collapsed && (
              <div className="flex items-center gap-2 font-bold text-primary">
                <Package className="w-6 h-6" />
                <span>StockShot</span>
              </div>
            )}
            {collapsed && <Package className="w-6 h-6 text-primary mx-auto" />}
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 absolute -right-3 top-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {filteredItems.map((item) => (
              <SidebarItem 
                key={item.href}
                {...item}
                active={location.pathname === item.href}
                collapsed={collapsed}
              />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800">
            {!collapsed && userData && (
              <div className="mb-4 px-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">User Info</p>
                <p className="text-sm font-medium truncate">{userData.email}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tight">{userData.role}</p>
              </div>
            )}
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 gap-3",
                collapsed ? "px-2" : "px-3"
              )}
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span className="font-medium text-sm">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300",
          collapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
