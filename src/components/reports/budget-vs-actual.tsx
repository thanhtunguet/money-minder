import { useEffect, useState } from "react";
import { useFinance } from "@/context";
import { getBudgetVsActual, formatCurrency } from "@/lib/finance-utils";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/integrations/supabase/client";

export function BudgetVsActualReport() {
  const { state } = useFinance();
  const { user } = useAuth();
  const [currency, setCurrency] = useState<string>("VND");

  // Get budget vs actual data
  const budgetVsActual = getBudgetVsActual(state.budgets, state.transactions);

  // Get user currency preference
  useEffect(() => {
    const fetchUserCurrency = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("currency")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        if (data && data.currency) {
          setCurrency(data.currency);
        }
      } catch (error) {
        console.error("Error fetching user currency:", error);
      }
    };

    fetchUserCurrency();
  }, [user]);

  if (budgetVsActual.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs. Actual Spending</CardTitle>
          <CardDescription>
            Create a budget to see your spending progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground">No budget data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Actual Spending</CardTitle>
        <CardDescription>
          Track how your actual spending compares to your budget.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {budgetVsActual.map((item) => {
          const percentage =
            item.budgeted > 0
              ? Math.min(Math.round((item.spent / item.budgeted) * 100), 100)
              : 0;
          const isOverBudget = item.spent > item.budgeted;

          return (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{item.category}</p>
                  <div className="text-sm text-muted-foreground">
                    <span>{formatCurrency(item.spent, currency)}</span>
                    <span className="mx-1">/</span>
                    <span>{formatCurrency(item.budgeted, currency)}</span>
                  </div>
                </div>
                <p
                  className={`font-medium ${
                    isOverBudget ? "text-destructive" : "text-green-500"
                  }`}
                >
                  {percentage}%
                </p>
              </div>

              <Progress
                value={percentage}
                className={isOverBudget ? "bg-red-200" : undefined}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
