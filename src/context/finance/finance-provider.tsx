import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useState,
  useEffect,
  type FC,
} from "react";
import { financeReducer, initialState } from "./finance-reducer";
import { FinanceContextType, Transaction, Budget } from "./types";
import { toast } from "@/components/ui/use-toast";
import {
  loadTransactions,
  loadBudgets,
  createTransaction,
  removeTransaction,
  modifyTransaction,
  createBudget,
  removeBudget,
  modifyBudget,
} from "./finance-api";
import { FinanceContext } from "./finance-context";
import { useAuth } from "../auth-context";

export const FinanceProvider: FC<{ children: ReactNode }> = ({ children }) => {
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
        const transactions = await loadTransactions();
        dispatch({ type: "SET_TRANSACTIONS", payload: transactions });

        // Load budgets
        const budgets = await loadBudgets();
        dispatch({ type: "SET_BUDGETS", payload: budgets });
      } catch (error) {
        console.error("Error loading user data:", error);
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

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      if (!user) throw new Error("User not authenticated");
      const newTransaction = await createTransaction(transaction, user.id);
      dispatch({ type: "ADD_TRANSACTION", payload: newTransaction });

      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await removeTransaction(id);
      dispatch({ type: "DELETE_TRANSACTION", payload: id });

      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    try {
      await modifyTransaction(transaction);
      dispatch({ type: "UPDATE_TRANSACTION", payload: transaction });

      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  const addBudget = async (budget: Budget) => {
    try {
      if (!user) throw new Error("User not authenticated");
      const newBudget = await createBudget(budget, user.id);
      dispatch({ type: "ADD_BUDGET", payload: budget });

      toast({
        title: "Success",
        description: "Budget added successfully",
      });
    } catch (error) {
      console.error("Error adding budget:", error);
      toast({
        title: "Error",
        description: "Failed to add budget",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteBudget = async (category: string) => {
    try {
      await removeBudget(category);
      dispatch({ type: "DELETE_BUDGET", payload: category });

      toast({
        title: "Success",
        description: "Budget deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast({
        title: "Error",
        description: "Failed to delete budget",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateBudget = async (budget: Budget) => {
    try {
      await modifyBudget(budget);
      dispatch({ type: "UPDATE_BUDGET", payload: budget });

      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive",
      });
      throw error;
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
        isLoading,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
