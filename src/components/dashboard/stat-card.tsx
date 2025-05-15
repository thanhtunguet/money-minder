
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, trend, icon, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-bold">{value}</h3>
          {trend && (
            <div className="flex items-center mt-1 text-xs">
              {trend.isPositive ? (
                <ArrowUp className="mr-1 h-3 w-3 text-finance-income" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3 text-finance-expense" />
              )}
              <span
                className={
                  trend.isPositive ? "text-finance-income" : "text-finance-expense"
                }
              >
                {trend.value}% from last month
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
