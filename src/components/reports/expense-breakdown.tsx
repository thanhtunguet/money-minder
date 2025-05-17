
import { useState, useEffect } from "react";
import { useFinance } from "@/context/finance/finance-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { getExpensesByCategory, formatCurrency } from "@/lib/finance-utils";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/integrations/supabase/client";

// Color array for the pie chart slices
const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", 
  "#00c49f", "#ff5722", "#673ab7", "#3f51b5", "#e91e63"
];

export function ExpenseBreakdownReport() {
  const { state } = useFinance();
  const { user } = useAuth();
  const [currency, setCurrency] = useState<string>("VND");
  
  // Get expense breakdown data
  const expensesByCategory = getExpensesByCategory(state.transactions);
  
  // Format data for the pie chart
  const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount
  }));
  
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
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-4 border rounded-lg shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p>{`Amount: ${formatCurrency(payload[0].value, currency)}`}</p>
        </div>
      );
    }
    return null;
  };
  
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>
            Add expense transactions to see your spending breakdown.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground">No expense data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>
          See how your expenses are distributed across categories.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
