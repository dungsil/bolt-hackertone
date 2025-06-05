import { Account, Transaction, User, DashboardSummary } from '../types';
import { addDays, subDays, format } from 'date-fns';

// Mock user
export const currentUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
};

// Mock accounts
export const accounts: Account[] = [
  {
    id: 'account-1',
    name: 'Checking Account',
    type: 'asset',
    balance: 5250.75,
    currency: 'USD',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-06-15T00:00:00Z',
  },
  {
    id: 'account-2',
    name: 'Savings Account',
    type: 'asset',
    balance: 12500.00,
    currency: 'USD',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-06-10T00:00:00Z',
  },
  {
    id: 'account-3',
    name: 'Credit Card',
    type: 'liability',
    balance: 1250.50,
    currency: 'USD',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-06-12T00:00:00Z',
  },
  {
    id: 'account-4',
    name: 'Salary',
    type: 'revenue',
    balance: 45000.00,
    currency: 'USD',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-06-01T00:00:00Z',
  },
  {
    id: 'account-5',
    name: 'Rent',
    type: 'expense',
    balance: 12000.00,
    currency: 'USD',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-06-05T00:00:00Z',
  },
  {
    id: 'account-6',
    name: 'Groceries',
    type: 'expense',
    balance: 3600.00,
    currency: 'USD',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-06-08T00:00:00Z',
  },
  {
    id: 'account-7',
    name: 'Utilities',
    type: 'expense',
    balance: 2400.00,
    currency: 'USD',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-06-10T00:00:00Z',
  },
];

// Generate dates for transactions
const today = new Date();
const dates = Array.from({ length: 10 }, (_, i) => 
  format(subDays(today, i * 3), 'yyyy-MM-dd')
);

// Mock transactions
export const transactions: Transaction[] = [
  {
    id: 'tx-1',
    date: dates[0],
    description: 'Salary deposit',
    entries: [
      { id: 'entry-1', accountId: 'account-1', amount: 3750, type: 'debit' },
      { id: 'entry-2', accountId: 'account-4', amount: 3750, type: 'credit' },
    ],
    createdAt: dates[0] + 'T09:30:00Z',
    updatedAt: dates[0] + 'T09:30:00Z',
  },
  {
    id: 'tx-2',
    date: dates[1],
    description: 'Rent payment',
    entries: [
      { id: 'entry-3', accountId: 'account-5', amount: 1000, type: 'debit' },
      { id: 'entry-4', accountId: 'account-1', amount: 1000, type: 'credit' },
    ],
    createdAt: dates[1] + 'T10:15:00Z',
    updatedAt: dates[1] + 'T10:15:00Z',
  },
  {
    id: 'tx-3',
    date: dates[2],
    description: 'Grocery shopping',
    entries: [
      { id: 'entry-5', accountId: 'account-6', amount: 150, type: 'debit' },
      { id: 'entry-6', accountId: 'account-3', amount: 150, type: 'credit' },
    ],
    createdAt: dates[2] + 'T14:45:00Z',
    updatedAt: dates[2] + 'T14:45:00Z',
  },
  {
    id: 'tx-4',
    date: dates[3],
    description: 'Credit card payment',
    entries: [
      { id: 'entry-7', accountId: 'account-3', amount: 500, type: 'debit' },
      { id: 'entry-8', accountId: 'account-1', amount: 500, type: 'credit' },
    ],
    createdAt: dates[3] + 'T16:20:00Z',
    updatedAt: dates[3] + 'T16:20:00Z',
  },
  {
    id: 'tx-5',
    date: dates[4],
    description: 'Utility bills',
    entries: [
      { id: 'entry-9', accountId: 'account-7', amount: 200, type: 'debit' },
      { id: 'entry-10', accountId: 'account-1', amount: 200, type: 'credit' },
    ],
    createdAt: dates[4] + 'T11:10:00Z',
    updatedAt: dates[4] + 'T11:10:00Z',
  },
  {
    id: 'tx-6',
    date: dates[5],
    description: 'Transfer to savings',
    entries: [
      { id: 'entry-11', accountId: 'account-2', amount: 1000, type: 'debit' },
      { id: 'entry-12', accountId: 'account-1', amount: 1000, type: 'credit' },
    ],
    createdAt: dates[5] + 'T09:45:00Z',
    updatedAt: dates[5] + 'T09:45:00Z',
  },
  {
    id: 'tx-7',
    date: dates[6],
    description: 'Grocery shopping',
    entries: [
      { id: 'entry-13', accountId: 'account-6', amount: 120, type: 'debit' },
      { id: 'entry-14', accountId: 'account-1', amount: 120, type: 'credit' },
    ],
    createdAt: dates[6] + 'T17:30:00Z',
    updatedAt: dates[6] + 'T17:30:00Z',
  },
  {
    id: 'tx-8',
    date: dates[7],
    description: 'Salary deposit',
    entries: [
      { id: 'entry-15', accountId: 'account-1', amount: 3750, type: 'debit' },
      { id: 'entry-16', accountId: 'account-4', amount: 3750, type: 'credit' },
    ],
    createdAt: dates[7] + 'T09:30:00Z',
    updatedAt: dates[7] + 'T09:30:00Z',
  },
  {
    id: 'tx-9',
    date: dates[8],
    description: 'Utility bills',
    entries: [
      { id: 'entry-17', accountId: 'account-7', amount: 180, type: 'debit' },
      { id: 'entry-18', accountId: 'account-1', amount: 180, type: 'credit' },
    ],
    createdAt: dates[8] + 'T13:15:00Z',
    updatedAt: dates[8] + 'T13:15:00Z',
  },
  {
    id: 'tx-10',
    date: dates[9],
    description: 'Grocery shopping',
    entries: [
      { id: 'entry-19', accountId: 'account-6', amount: 135, type: 'debit' },
      { id: 'entry-20', accountId: 'account-3', amount: 135, type: 'credit' },
    ],
    createdAt: dates[9] + 'T15:50:00Z',
    updatedAt: dates[9] + 'T15:50:00Z',
  },
];

// Mock dashboard summary
export const dashboardSummary: DashboardSummary = {
  totalAssets: 17750.75,
  totalLiabilities: 1250.50,
  netWorth: 16500.25,
  monthlyIncome: 7500,
  monthlyExpenses: 3000,
  monthlySavings: 4500,
};