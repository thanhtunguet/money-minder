
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/context";
import { formatCurrency } from "@/lib/finance-utils";
import { QuickTransactionForm } from "@/components/transactions/quick-transaction-form";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { Plus, TrendingUp, TrendingDown, DollarSign, Menu, User } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileDashboard() {
  const { state } = useFinance();
  const { signOut, user } = useAuth();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Calculate totals
  const totalIncome = state.transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = state.transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Transactions", path: "/transactions" },
    { name: "Budget", path: "/budget" },
    { name: "Reports", path: "/reports" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                MoneyMinder
              </SheetTitle>
              <SheetDescription>
                Navigate your financial dashboard
              </SheetDescription>
            </SheetHeader>
            <nav className="mt-6 space-y-2">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{user?.email}</span>
              </div>
              <Button variant="outline" onClick={signOut} className="w-full">
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-semibold">Dashboard</h1>

        <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
          <User className="h-6 w-6" />
          <span className="sr-only">User profile</span>
        </Button>
      </div>

      {/* Balance Card */}
      <div className="p-4">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm opacity-90 mb-2">Total Balance</p>
              <h2 className="text-4xl font-bold mb-6">{formatCurrency(balance)}</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-sm font-medium">Income</span>
                  </div>
                  <p className="text-lg font-semibold">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingDown className="h-5 w-5" />
                    <span className="text-sm font-medium">Expenses</span>
                  </div>
                  <p className="text-lg font-semibold">{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Add Button - Floating Action Button Style */}
      <div className="px-4 mb-6">
        <Drawer open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
          <DrawerTrigger asChild>
            <Button 
              size="lg" 
              className="w-full rounded-xl h-16 text-lg font-semibold shadow-lg"
            >
              <Plus className="mr-3 h-6 w-6" />
              Add Transaction
            </Button>
          </DrawerTrigger>
          <DrawerContent className="px-4 pb-8 max-h-[90vh]">
            <DrawerHeader>
              <DrawerTitle className="text-xl">Add New Transaction</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto">
              <QuickTransactionForm />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 pb-6">
        <RecentTransactions />
      </div>
    </div>
  );
}
