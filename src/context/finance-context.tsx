
import { createContext, useContext, useReducer, ReactNode, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from './auth-context';
import { toast } from '@/components/ui/use-toast';

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
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  addBudget: (budget: Budget) => Promise<void>;
  deleteBudget: (category: string) => Promise<void>;
  updateBudget: (budget: Budget) => Promise<void>;
  isLoading: boolean;
};

// Initial state
const initialState: FinanceState = {
  transactions: [],
  budgets: [],
};

// Create context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Actions
type Action =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_BUDGETS'; payload: Budget[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'UPDATE_BUDGET'; payload: Budget };

// Reducer
function financeReducer(state: FinanceState, action: Action): FinanceState {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
      };
    case 'SET_BUDGETS':
      return {
        ...state,
        budgets: action.payload,
      };
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
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load data from Supabase on mount or when user changes
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    async function loadUserData() {
      setIsLoading(true);
      try {
        // Load transactions
        const { data: transactions, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });

        if (transactionsError) {
          throw transactionsError;
        }

        // Load budgets
        const { data: budgets, error: budgetsError } = await supabase
          .from('budgets')
          .select('*');

        if (budgetsError) {
          throw budgetsError;
        }

        dispatch({ type: 'SET_TRANSACTIONS', payload: transactions as Transaction[] });
        dispatch({ type: 'SET_BUDGETS', payload: budgets as Budget[] });
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading your financial data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({ ...transaction, user_id: user?.id })
        .select('*')
        .single();

      if (error) throw error;

      dispatch({ type: 'ADD_TRANSACTION', payload: data as Transaction });
      
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          amount: transaction.amount,
          category: transaction.category,
          description: transaction.description,
          date: transaction.date,
          type: transaction.type,
        })
        .eq('id', transaction.id);

      if (error) throw error;

      dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
      
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  const addBudget = async (budget: Budget) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert({ 
          category: budget.category, 
          amount: budget.amount, 
          user_id: user?.id 
        })
        .select('*')
        .single();

      if (error) throw error;

      dispatch({ type: 'ADD_BUDGET', payload: budget });
      
      toast({
        title: "Success",
        description: "Budget added successfully",
      });
    } catch (error) {
      console.error('Error adding budget:', error);
      toast({
        title: "Error",
        description: "Failed to add budget",
        variant: "destructive",
      });
    }
  };

  const deleteBudget = async (category: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('category', category);

      if (error) throw error;

      dispatch({ type: 'DELETE_BUDGET', payload: category });
      
      toast({
        title: "Success",
        description: "Budget deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast({
        title: "Error",
        description: "Failed to delete budget",
        variant: "destructive",
      });
    }
  };

  const updateBudget = async (budget: Budget) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .update({ amount: budget.amount })
        .eq('category', budget.category);

      if (error) throw error;

      dispatch({ type: 'UPDATE_BUDGET', payload: budget });
      
      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive",
      });
    }
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
        isLoading
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
