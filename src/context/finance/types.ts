
// Types for the finance context
export type Transaction = {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
};

export type Budget = {
  category: string;
  amount: number;
  purpose?: string;
  description?: string;
};

export type FinanceState = {
  transactions: Transaction[];
  budgets: Budget[];
};

// Actions for the finance reducer
export type FinanceAction =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_BUDGETS'; payload: Budget[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'UPDATE_BUDGET'; payload: Budget };

// Context type with state and actions
export type FinanceContextType = {
  state: FinanceState;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  addBudget: (budget: Budget) => Promise<void>;
  deleteBudget: (category: string) => Promise<void>;
  updateBudget: (budget: Budget) => Promise<void>;
  isLoading: boolean;
};
