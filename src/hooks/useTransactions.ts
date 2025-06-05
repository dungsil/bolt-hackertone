```typescript
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '@/lib/db';
import { transactions, transactionEntries, accounts } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { supabase } from '@/lib/db';

export interface TransactionWithEntries {
  id: string;
  date: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  entries: {
    id: string;
    accountId: string;
    amount: number;
    type: 'debit' | 'credit';
    account: {
      name: string;
    };
  }[];
}

export function useTransactions() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TransactionWithEntries[]>([]);
  const { i18n } = useTranslation();

  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const result = await db.query.transactions.findMany({
        where: eq(transactions.userId, user.id),
        orderBy: desc(transactions.date),
        with: {
          entries: {
            with: {
              account: true
            }
          }
        }
      });

      setData(result.map(tx => ({
        ...tx,
        date: new Date(tx.date),
        createdAt: new Date(tx.createdAt),
        updatedAt: new Date(tx.updatedAt),
        entries: tx.entries.map(entry => ({
          ...entry,
          amount: Number(entry.amount)
        }))
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const createTransaction = async (data: {
    date: string;
    description: string;
    entries: Array<{
      accountId: string;
      amount: number;
      type: 'debit' | 'credit';
    }>;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const [newTransaction] = await db
        .insert(transactions)
        .values({
          userId: user.id,
          date: new Date(data.date),
          description: data.description
        })
        .returning();

      await db.insert(transactionEntries).values(
        data.entries.map(entry => ({
          transactionId: newTransaction.id,
          accountId: entry.accountId,
          amount: entry.amount,
          type: entry.type
        }))
      );

      // Update account balances
      for (const entry of data.entries) {
        const account = await db.query.accounts.findFirst({
          where: eq(accounts.id, entry.accountId)
        });
        
        if (account) {
          const balanceChange = entry.type === 'debit' ? entry.amount : -entry.amount;
          await db
            .update(accounts)
            .set({ balance: account.balance + balanceChange })
            .where(eq(accounts.id, entry.accountId));
        }
      }

      await fetchTransactions();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create transaction');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [i18n.language]);

  return {
    transactions: data,
    isLoading,
    error,
    createTransaction,
    refetch: fetchTransactions
  };
}
```