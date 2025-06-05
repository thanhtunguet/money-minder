
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
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Type Toggle */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Transaction Type</Label>
          <div className="flex rounded-lg border p-1 bg-muted">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: "expense", category: "" }))}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200",
                formData.type === "expense"
                  ? "bg-red-500 text-white shadow-sm"
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
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200",
                formData.type === "income"
                  ? "bg-green-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Plus className="h-4 w-4" />
              Income
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-3">
          <Label htmlFor="amount" className="text-base font-medium">Amount</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg">$</span>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleAmountChange}
              className="text-2xl font-semibold text-center h-14 pl-8"
              required
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-3">
          <Label htmlFor="category" className="text-base font-medium">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger id="category" className="h-12 text-base">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-base py-3">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description Input */}
        <div className="space-y-3">
          <Label htmlFor="description" className="text-base font-medium">Description (optional)</Label>
          <Input
            id="description"
            placeholder="Add note..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="h-12 text-base"
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full h-14 text-lg font-semibold mt-8">
          Add Transaction
        </Button>
      </form>
    </div>
  );
}
