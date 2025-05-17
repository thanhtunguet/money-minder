import { useContext } from "react";
import { FinanceContext } from "./finance-context";

// Hook for consuming the Finance context
export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
