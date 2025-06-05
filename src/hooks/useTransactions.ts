import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/db';

export interface TransactionWithEntries {
  id: string;
  date: Date;
  description: string;
  created_at: Date;
  updated_at: Date;
  entries: {
    id: string;
    account_id: string;
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

      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select(`
          *,
          entries:transaction_entries(
            *,
            account:accounts(name)
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (txError) throw txError;

      setData(transactions.map(tx => ({
        ...tx,
        date: new Date(tx.date),
        created_at: new Date(tx.created_at),
        updated_at: new Date(tx.updated_at),
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

      // Start a Supabase transaction
      const { data: newTransaction, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          date: new Date(data.date),
          description: data.description
        })
        .select()
        .single();

      if (txError) throw txError;

      // Insert transaction entries
      const { error: entriesError } = await supabase
        .from('transaction_entries')
        .insert(
          data.entries.map(entry => ({
            transaction_id: newTransaction.id,
            account_id: entry.accountId,
            amount: entry.amount,
            type: entry.type
          }))
        );

      if (entriesError) throw entriesError;

      // Update account balances
      for (const entry of data.entries) {
        // Get current account balance
        const { data: account, error: accountError } = await supabase
          .from('accounts')
          .select('balance')
          .eq('id', entry.accountId)
          .single();

        if (accountError) throw accountError;

        const balanceChange = entry.type === 'debit' ? entry.amount : -entry.amount;
        const newBalance = Number(account.balance) + balanceChange;

        // Update account balance
        const { error: updateError } = await supabase
          .from('accounts')
          .update({ balance: newBalance })
          .eq('id', entry.accountId);

        if (updateError) throw updateError;
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