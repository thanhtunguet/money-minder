
import { createContext, useContext, useReducer, ReactNode, useState, useEffect } from 'react';

// Define types
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

type FinanceState = {
  transactions: Transaction[];
  budgets: Budget[];
};

type FinanceContextType = {
  state: FinanceState;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (transaction: Transaction) => void;
  addBudget: (budget: Budget) => void;
  deleteBudget: (category: string) => void;
  updateBudget: (budget: Budget) => void;
};

// Initial mock data
const initialTransactions: Transaction[] = [
  { id: '1', date: '2023-05-01', amount: 3000, category: 'Salary', description: 'Monthly salary', type: 'income' },
  { id: '2', date: '2023-05-03', amount: 120.50, category: 'Groceries', description: 'Weekly shopping', type: 'expense' },
  { id: '3', date: '2023-05-05', amount: 45.99, category: 'Dining', description: 'Restaurant dinner', type: 'expense' },
  { id: '4', date: '2023-05-10', amount: 200, category: 'Utilities', description: 'Electricity bill', type: 'expense' },
  { id: '5', date: '2023-05-15', amount: 500, category: 'Freelance', description: 'Website project', type: 'income' },
  { id: '6', date: '2023-05-18', amount: 35.99, category: 'Entertainment', description: 'Movie tickets', type: 'expense' },
  { id: '7', date: '2023-05-20', amount: 85.75, category: 'Transport', description: 'Fuel', type: 'expense' },
];

const initialBudgets: Budget[] = [
  { category: 'Groceries', amount: 400 },
  { category: 'Dining', amount: 200 },
  { category: 'Entertainment', amount: 150 },
  { category: 'Transport', amount: 300 },
  { category: 'Utilities', amount: 250 },
];

const initialState: FinanceState = {
  transactions: initialTransactions,
  budgets: initialBudgets,
};

// Create context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Actions
type Action =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'UPDATE_BUDGET'; payload: Budget };

// Reducer
function financeReducer(state: FinanceState, action: Action): FinanceState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t => 
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'ADD_BUDGET':
      return {
        ...state,
        budgets: [...state.budgets, action.payload],
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(b => b.category !== action.payload),
      };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(b => 
          b.category === action.payload.category ? action.payload : b
        ),
      };
    default:
      return state;
  }
}

// Provider
export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('moneyminder-transactions');
    const savedBudgets = localStorage.getItem('moneyminder-budgets');
    
    if (savedTransactions) {
      dispatch({ 
        type: 'ADD_TRANSACTION', 
        payload: JSON.parse(savedTransactions) 
      });
    }
    
    if (savedBudgets) {
      dispatch({ 
        type: 'ADD_BUDGET', 
        payload: JSON.parse(savedBudgets) 
      });
    }
  }, []);

  // Save data to localStorage on state change
  useEffect(() => {
    localStorage.setItem('moneyminder-transactions', JSON.stringify(state.transactions));
    localStorage.setItem('moneyminder-budgets', JSON.stringify(state.budgets));
  }, [state]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: new Date().getTime().toString(),
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  };

  const addBudget = (budget: Budget) => {
    dispatch({ type: 'ADD_BUDGET', payload: budget });
  };

  const deleteBudget = (category: string) => {
    dispatch({ type: 'DELETE_BUDGET', payload: category });
  };

  const updateBudget = (budget: Budget) => {
    dispatch({ type: 'UPDATE_BUDGET', payload: budget });
  };

  return (
    <FinanceContext.Provider
      value={{
        state,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        addBudget,
        deleteBudget,
        updateBudget,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

// Hook
export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
