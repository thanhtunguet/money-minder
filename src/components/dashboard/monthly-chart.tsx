
import { useFinance } from "@/context/finance/finance-context";
import { getMonthlyTrends, formatCurrency } from "@/lib/finance-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function MonthlyChart() {
  const { state } = useFinance();
  // Make sure state.transactions exists before trying to process it
  const trendData = state.transactions ? getMonthlyTrends(state.transactions) : [];

  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-base">6 Month Spending Overview</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={trendData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="month" 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              tickFormatter={(value) => `$${value}`} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ 
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)' 
              }}
            />
            <Legend />
            <Bar dataKey="income" fill="var(--finance-income)" name="Income" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="var(--finance-expense)" name="Expenses" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
