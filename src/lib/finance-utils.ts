
import { format, subMonths, isSameMonth, parseISO } from 'date-fns';

// Types from context
type Transaction = {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
};

type Budget = {
  category: string;
  amount: number;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Get month name
export const getMonthName = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

// Get total income for given transactions
export const getTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
};

// Get total expenses for given transactions
export const getTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
};

// Get net balance
export const getNetBalance = (transactions: Transaction[]): number => {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
};

// Get transactions for a specific month
export const getTransactionsForMonth = (
  transactions: Transaction[],
  month: Date
): Transaction[] => {
  return transactions.filter(t => {
    // Add validation to make sure the date is a valid string before parsing
    if (!t.date || typeof t.date !== 'string') {
      return false;
    }
    try {
      return isSameMonth(parseISO(t.date), month);
    } catch (error) {
      console.error("Invalid date format:", t.date);
      return false;
    }
  });
};

// Get expense by category
export const getExpensesByCategory = (transactions: Transaction[]): Record<string, number> => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const { category, amount } = t;
      return {
        ...acc,
        [category]: (acc[category] || 0) + amount,
      };
    }, {} as Record<string, number>);
};

// Get budget vs actual spending
export const getBudgetVsActual = (
  budgets: Budget[],
  transactions: Transaction[]
): { category: string; budgeted: number; spent: number }[] => {
  const expensesByCategory = getExpensesByCategory(transactions);
  
  return budgets.map(budget => ({
    category: budget.category,
    budgeted: budget.amount,
    spent: expensesByCategory[budget.category] || 0,
  }));
};

// Get monthly spending trends (last 6 months)
export const getMonthlyTrends = (
  transactions: Transaction[],
  monthsToShow: number = 6
): { month: string; income: number; expenses: number }[] => {
  const result = [];
  const today = new Date();
  
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const month = subMonths(today, i);
    const monthTransactions = getTransactionsForMonth(transactions, month);
    
    result.push({
      month: format(month, 'MMM'),
      income: getTotalIncome(monthTransactions),
      expenses: getTotalExpenses(monthTransactions),
    });
  }
  
  return result;
};

// Get available categories
export const getCategories = (transactions: Transaction[]): string[] => {
  const categories = new Set<string>();
  
  transactions.forEach(t => {
    categories.add(t.category);
  });
  
  return Array.from(categories).sort();
};

// Get common expense categories
export const EXPENSE_CATEGORIES = [
  'Groceries',
  'Dining',
  'Transport',
  'Utilities',
  'Rent',
  'Entertainment',
  'Shopping',
  'Health',
  'Education',
  'Travel',
  'Other'
];

// Get common income categories
export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Gifts',
  'Refunds',
  'Other'
];
