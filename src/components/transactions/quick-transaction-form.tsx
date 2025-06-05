
import { useState } from "react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/finance-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useFinance } from "@/context";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuickTransactionForm() {
  const { addTransaction } = useFinance();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    type: "expense" as "income" | "expense",
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, amount: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.category) {
      toast({
        title: "Missing fields",
        description: "Please enter amount and select category",
        variant: "destructive",
      });
      return;
    }

    addTransaction({
      date: new Date().toISOString().split("T")[0],
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description || `${formData.type} - ${formData.category}`,
      type: formData.type,
    });

    toast({
      title: "Transaction added",
      description: `${formData.type === "income" ? "Income" : "Expense"} of $${formData.amount} added`,
    });

    // Reset form
    setFormData({
      amount: "",
      category: "",
      description: "",
      type: "expense",
    });
  };

  const categories = formData.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-center">Quick Add</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Transaction Type Toggle */}
          <div className="flex rounded-lg border p-1">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: "expense", category: "" }))}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                formData.type === "expense"
                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Minus className="h-4 w-4" />
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: "income", category: "" }))}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                formData.type === "income"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Plus className="h-4 w-4" />
              Income
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm">Amount</Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleAmountChange}
              className="text-lg text-center font-semibold"
              required
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">Description (optional)</Label>
            <Input
              id="description"
              placeholder="Add note..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="text-sm"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            Add Transaction
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
