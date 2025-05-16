
import { useFinance } from "@/context/finance-context";
import { getBudgetVsActual, formatCurrency } from "@/lib/finance-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function BudgetProgress() {
  const { state } = useFinance();
  const budgetVsActual = getBudgetVsActual(state.budgets, state.transactions);

  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-base">Budget Progress</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4 space-y-4">
        {budgetVsActual.length > 0 ? (
          budgetVsActual.map((item) => {
            const percentage = Math.min(
              Math.round((item.spent / item.budgeted) * 100),
              100
            );
            const isOverBudget = item.spent > item.budgeted;

            return (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.category}</span>
                  <span>
                    {formatCurrency(item.spent)} / {formatCurrency(item.budgeted)}
                  </span>
                </div>
                <Progress
                  value={percentage}
                  className={cn(
                    isOverBudget ? "bg-red-200" : undefined
                  )}
                  // Using className instead of indicatorClassName for the Progress indicator
                  // The indicator style is applied via CSS
                />
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No budget data available
          </div>
        )}

        <div className="flex justify-end pt-2">
          <a
            href="/budget"
            className="text-sm text-primary hover:underline"
          >
            Manage budgets →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
