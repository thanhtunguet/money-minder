import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { financeReducer, initialState } from "./finance-reducer";
import { FinanceContextType, Transaction, Budget } from "./types";
import { useAuth } from "../auth-context";
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

// Create the Finance context
export const FinanceContext = createContext<FinanceContextType | undefined>(
  undefined
);
