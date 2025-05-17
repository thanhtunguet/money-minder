
import { useState } from "react";
import { useFinance } from "@/context/finance-context";
import { formatCurrency } from "@/lib/finance-utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function BudgetList() {
  const { state, deleteBudget } = useFinance();
  const { user } = useAuth();
  const [currency, setCurrency] = useState<string>("VND");
  const [deletingBudgetId, setDeletingBudgetId] = useState<string | null>(null);
  
  // Get user currency preference
  useState(() => {
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
  });
  
  const handleDeleteBudget = async (category: string) => {
    try {
      await deleteBudget(category);
      toast({
        title: "Budget deleted",
        description: "Your budget has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete budget. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingBudgetId(null);
    }
  };

  if (state.budgets.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No budgets found. Create your first budget to get started.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.budgets.map((budget) => (
            <TableRow key={`${budget.category}-${budget.purpose}`}>
              <TableCell>
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary">
                  {budget.category}
                </span>
              </TableCell>
              <TableCell className="font-medium">{budget.purpose || "-"}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {budget.description || "-"}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(budget.amount, currency)}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this budget? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteBudget(budget.category)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
