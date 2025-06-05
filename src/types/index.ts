export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  entries: TransactionEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface TransactionEntry {
  id: string;
  accountId: string;
  amount: number;
  type: 'debit' | 'credit';
}

export interface DashboardSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
}