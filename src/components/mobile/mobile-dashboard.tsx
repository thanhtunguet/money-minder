
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/context";
import { formatCurrency } from "@/lib/finance-utils";
import { QuickTransactionForm } from "@/components/transactions/quick-transaction-form";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function MobileDashboard() {
  const { state } = useFinance();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Calculate totals
  const totalIncome = state.transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = state.transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Balance */}
      <div className="bg-primary text-primary-foreground p-6 rounded-b-3xl mb-6">
        <div className="text-center">
          <p className="text-sm opacity-90 mb-2">Total Balance</p>
          <h1 className="text-3xl font-bold mb-4">{formatCurrency(balance)}</h1>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-2xl p-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">Income</span>
              </div>
              <p className="font-semibold">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingDown className="h-4 w-4" />
                <span className="text-xs">Expenses</span>
              </div>
              <p className="font-semibold">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Button */}
      <div className="px-6 mb-6">
        <Drawer open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
          <DrawerTrigger asChild>
            <Button size="lg" className="w-full rounded-2xl h-14 text-lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Transaction
            </Button>
          </DrawerTrigger>
          <DrawerContent className="px-4 pb-8">
            <DrawerHeader>
              <DrawerTitle>Add New Transaction</DrawerTitle>
            </DrawerHeader>
            <QuickTransactionForm />
          </DrawerContent>
        </Drawer>
      </div>

      {/* Recent Transactions */}
      <div className="px-6">
        <RecentTransactions />
      </div>
    </div>
  );
}
