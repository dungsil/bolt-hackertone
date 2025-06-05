import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/db';

export interface DashboardSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
}

export function useDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardSummary>({
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlySavings: 0,
  });
  const { i18n } = useTranslation();

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get account balances
      const { data: accounts, error: accountsError } = await supabase
        .from('accounts')
        .select('type, balance')
        .eq('user_id', user.id);

      if (accountsError) throw accountsError;

      // Calculate totals from accounts
      const totals = accounts.reduce((acc, account) => {
        const balance = Number(account.balance);
        switch (account.type) {
          case 'asset':
            acc.totalAssets += balance;
            break;
          case 'liability':
            acc.totalLiabilities += balance;
            break;
          case 'revenue':
            acc.monthlyIncome += balance;
            break;
          case 'expense':
            acc.monthlyExpenses += balance;
            break;
        }
        return acc;
      }, {
        totalAssets: 0,
        totalLiabilities: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
      });

      // Calculate derived values
      const netWorth = totals.totalAssets - totals.totalLiabilities;
      const monthlySavings = totals.monthlyIncome - totals.monthlyExpenses;

      setData({
        ...totals,
        netWorth,
        monthlySavings,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [i18n.language]);

  return {
    summary: data,
    isLoading,
    error,
    refetch: fetchDashboardData
  };
}