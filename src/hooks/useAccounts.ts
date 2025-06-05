import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/db';

export interface Account {
  id: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance: number;
  currency: string;
  created_at: Date;
  updated_at: Date;
}

export function useAccounts() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Account[]>([]);
  const { i18n } = useTranslation();

  const fetchAccounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: accounts, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (accountsError) throw accountsError;

      setData(accounts.map(account => ({
        ...account,
        balance: Number(account.balance),
        created_at: new Date(account.created_at),
        updated_at: new Date(account.updated_at),
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [i18n.language]);

  return {
    accounts: data,
    isLoading,
    error,
    refetch: fetchAccounts
  };
}