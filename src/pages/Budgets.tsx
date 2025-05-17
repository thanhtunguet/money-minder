
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { BudgetForm } from "@/components/budgets/budget-form";
import { BudgetList } from "@/components/budgets/budget-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useFinance } from "@/context/finance-context";

export default function Budgets() {
  const [open, setOpen] = useState(false);
  const { isLoading } = useFinance();
  
  const handleSuccess = () => {
    setOpen(false);
  };
  
  if (isLoading) {
    return (
      <MainLayout currentPage="budgets">
        <div className="h-[80vh] w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout currentPage="budgets">
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Budget Management</h1>
            <p className="text-muted-foreground">
              Create and manage your budgets to track spending goals.
            </p>
          </div>
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> New Budget
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Create a Budget</SheetTitle>
                <SheetDescription>
                  Set up a new budget to track your spending goals.
                </SheetDescription>
              </SheetHeader>
              <div className="py-6">
                <BudgetForm onSuccess={handleSuccess} />
              </div>
            </SheetContent>
          </Sheet>
        </header>
        
        <div className="rounded-lg border">
          <BudgetList />
        </div>
      </div>
    </MainLayout>
  );
}
