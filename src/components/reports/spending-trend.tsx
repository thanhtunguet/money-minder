import { useState, useEffect } from "react";
import { useFinance } from "@/context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getMonthlyTrends, formatCurrency } from "@/lib/finance-utils";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/integrations/supabase/client";

export function SpendingTrendReport() {
  const { state } = useFinance();
  const { user } = useAuth();
  const [currency, setCurrency] = useState<string>("VND");

  // Get spending trend data
  const trendData = getMonthlyTrends(state.transactions);

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

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-4 border rounded-lg shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-green-500">{`Income: ${formatCurrency(
            payload[0].value,
            currency
          )}`}</p>
          <p className="text-destructive">{`Expenses: ${formatCurrency(
            payload[1].value,
            currency
          )}`}</p>
        </div>
      );
    }
    return null;
  };

  if (trendData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending Trends</CardTitle>
          <CardDescription>
            Add transactions to see your spending patterns.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground">
            No transaction data available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending Trends</CardTitle>
        <CardDescription>
          Track your income and expenses over the past 6 months.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={trendData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10b981" />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
