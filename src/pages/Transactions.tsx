import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useFinance } from "@/context/finance-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/finance-utils";
import { format, parseISO } from "date-fns";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/finance-utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { TransactionForm } from "@/components/transactions/transaction-form";

export default function Transactions() {
  const { state, isLoading, deleteTransaction } = useFinance();
  const [activeTab, setActiveTab] = useState("all");
  const [isDeleteLoading, setIsDeleteLoading] = useState<string | null>(null);
  const { user } = useAuth();

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    
    setIsDeleteLoading(id);
    try {
      await deleteTransaction(id);
    } finally {
      setIsDeleteLoading(null);
    }
  };

  const filterTransactions = () => {
    if (activeTab === "income") {
      return state.transactions.filter((t) => t.type === "income");
    } else if (activeTab === "expenses") {
      return state.transactions.filter((t) => t.type === "expense");
    }
    return state.transactions;
  };

  const sortedTransactions = filterTransactions().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <MainLayout currentPage="transactions">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Add Transaction</SheetTitle>
            </SheetHeader>
            <div className="py-6">
              <TransactionForm />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-right py-3 px-4">Amount</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8">
                          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        </td>
                      </tr>
                    ) : sortedTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-muted-foreground">
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      sortedTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            {format(parseISO(transaction.date), "MMM dd, yyyy")}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary">
                              {transaction.category}
                            </span>
                          </td>
                          <td className="py-3 px-4">{transaction.description || "-"}</td>
                          <td className={cn(
                            "py-3 px-4 text-right font-medium",
                            transaction.type === "income"
                              ? "text-green-600 dark:text-green-500"
                              : "text-red-600 dark:text-red-500"
                          )}>
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              disabled={isDeleteLoading === transaction.id}
                            >
                              {isDeleteLoading === transaction.id ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                              ) : (
                                "Delete"
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
