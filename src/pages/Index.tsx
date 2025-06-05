
import { useIsMobile } from "@/hooks/use-mobile";
import { MainLayout } from "@/components/layout/main-layout";
import { MobileDashboard } from "@/components/mobile/mobile-dashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { BudgetProgress } from "@/components/dashboard/budget-progress";
import { useFinance } from "@/context";
import { formatCurrency } from "@/lib/finance-utils";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export default function Index() {
  const isMobile = useIsMobile();
  const { state, isLoading } = useFinance();
  const { signOut } = useAuth();

  if (isLoading) {
    return (
      <MainLayout currentPage="dashboard">
        <div className="h-[80vh] w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  // If mobile, use the mobile-optimized dashboard
  if (isMobile) {
    return <MobileDashboard />;
  }

  // Desktop dashboard layout
  const totalIncome = state.transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = state.transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const totalBudget = state.budgets.reduce((sum, budget) => sum + budget.amount, 0);

  const userActions = (
    <Button variant="ghost" size="sm" onClick={signOut}>
      Sign Out
    </Button>
  );

  return (
    <MainLayout currentPage="dashboard" userActions={userActions}>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your financial overview.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Balance"
            value={formatCurrency(balance)}
            description="Current balance"
            icon={<DollarSign />}
          />
          <StatCard
            title="Total Income"
            value={formatCurrency(totalIncome)}
            description="This period"
            icon={<TrendingUp />}
            className="text-green-600"
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            description="This period"
            icon={<TrendingDown />}
            className="text-red-600"
          />
          <StatCard
            title="Total Budget"
            value={formatCurrency(totalBudget)}
            description="Allocated budget"
            icon={<Target />}
            className="text-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyChart />
          <CategoryPieChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentTransactions />
          <BudgetProgress />
        </div>
      </div>
    </MainLayout>
  );
}
