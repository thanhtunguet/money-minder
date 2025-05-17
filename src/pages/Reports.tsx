import { MainLayout } from "@/components/layout/main-layout";
import { useFinance } from "@/context";
import { BudgetVsActualReport } from "@/components/reports/budget-vs-actual";
import { SpendingTrendReport } from "@/components/reports/spending-trend";
import { ExpenseBreakdownReport } from "@/components/reports/expense-breakdown";

export default function Reports() {
  const { isLoading } = useFinance();

  if (isLoading) {
    return (
      <MainLayout currentPage="reports">
        <div className="h-[80vh] w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout currentPage="reports">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">
            Financial Reports
          </h1>
          <p className="text-muted-foreground">
            Get insights into your spending habits and financial progress.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BudgetVsActualReport />
          <ExpenseBreakdownReport />
          <div className="lg:col-span-2">
            <SpendingTrendReport />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
