
import { supabase } from "@/integrations/supabase/client";
import { Transaction, Budget } from './types';
import { toast } from '@/components/ui/use-toast';
import { User } from '@supabase/supabase-js';

// Load user transactions from Supabase
export async function loadTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}

// Load user budgets from Supabase
export async function loadBudgets() {
  const { data, error } = await supabase
    .from('budgets')
    .select('*');

  if (error) throw error;
  return data as Budget[];
}

// Add a new transaction
export async function createTransaction(transaction: Omit<Transaction, 'id'>, userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .insert({ ...transaction, user_id: userId })
    .select('*')
    .single();

  if (error) throw error;
  return data as Transaction;
}

// Delete a transaction
export async function removeTransaction(id: string) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Update a transaction
export async function modifyTransaction(transaction: Transaction) {
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
}

// Add a new budget
export async function createBudget(budget: Budget, userId: string) {
  const { data, error } = await supabase
    .from('budgets')
    .insert({ 
      category: budget.category, 
      amount: budget.amount, 
      purpose: budget.purpose,
      description: budget.description,
      user_id: userId 
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as Budget;
}

// Delete a budget
export async function removeBudget(category: string) {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('category', category);

  if (error) throw error;
}

// Update a budget
export async function modifyBudget(budget: Budget) {
  const { error } = await supabase
    .from('budgets')
    .update({ 
      amount: budget.amount,
      purpose: budget.purpose,
      description: budget.description
    })
    .eq('category', budget.category);

  if (error) throw error;
}
