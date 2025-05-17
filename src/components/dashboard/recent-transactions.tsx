
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/finance-utils";
import { useFinance } from "@/context/finance-context";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export function RecentTransactions() {
  const { state } = useFinance();
  const { user } = useAuth();
  const [currency, setCurrency] = useState<string>("VND");
  
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
  
  const recentTransactions = state.transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Recent Transactions</h3>
        <Link to="/transactions">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </Link>
      </div>
      <div className="border rounded-lg">
        <div className="transaction-row-header">
          <div className="col-span-2 px-4">Date</div>
          <div className="col-span-3 px-2">Category</div>
          <div className="col-span-4 px-2">Description</div>
          <div className="col-span-3 px-4 text-right">Amount</div>
        </div>
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-row">
              <div className="col-span-2 px-4 text-sm">
                {format(new Date(transaction.date), "MMM dd")}
              </div>
              <div className="col-span-3 px-2">
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary">
                  {transaction.category}
                </span>
              </div>
              <div className="col-span-4 px-2 text-sm truncate">
                {transaction.description}
              </div>
              <div
                className={cn(
                  "col-span-3 px-4 text-right font-medium",
                  transaction.type === "income"
                    ? "text-green-600 dark:text-green-500"
                    : "text-red-600 dark:text-red-500"
                )}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount, currency)}
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No transactions found
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Link
          to="/transactions"
          className="text-sm text-primary hover:underline"
        >
          View all transactions →
        </Link>
      </div>
    </div>
  );
}
