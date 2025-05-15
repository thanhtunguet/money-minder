
import { useFinance } from "@/context/finance-context";
import { MainLayout } from "@/components/layout/main-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart";
import { BudgetProgress } from "@/components/dashboard/budget-progress";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { getNetBalance, getTotalIncome, getTotalExpenses, formatCurrency } from "@/lib/finance-utils";
import { ArrowUpRight, ArrowDownRight, WalletCards, Wallet } from "lucide-react";

const Index = () => {
  const { state } = useFinance();
  
  const totalIncome = getTotalIncome(state.transactions);
  const totalExpenses = getTotalExpenses(state.transactions);
  const netBalance = getNetBalance(state.transactions);
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="moneyminder-theme">
      <FinanceProvider>
        <MainLayout currentPage="dashboard">
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Balance"
                value={formatCurrency(netBalance)}
                icon={<Wallet className="h-4 w-4" />}
              />
              <StatCard
                title="Income"
                value={formatCurrency(totalIncome)}
                trend={{ value: 12, isPositive: true }}
                icon={<ArrowUpRight className="h-4 w-4" />}
              />
              <StatCard
                title="Expenses"
                value={formatCurrency(totalExpenses)}
                trend={{ value: 5, isPositive: false }}
                icon={<ArrowDownRight className="h-4 w-4" />}
              />
              <StatCard
                title="Monthly Budget"
                value={formatCurrency(
                  state.budgets.reduce((acc, budget) => acc + budget.amount, 0)
                )}
                icon={<WalletCards className="h-4 w-4" />}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <MonthlyChart />
              <CategoryPieChart />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <RecentTransactions />
              </div>
              <div>
                <BudgetProgress />
              </div>
            </div>
            
            <div>
              <TransactionForm />
            </div>
          </div>
        </MainLayout>
      </FinanceProvider>
    </ThemeProvider>
  );
};

// Add the FinanceProvider wrapper
import { FinanceProvider } from "@/context/finance-context";

export default Index;
