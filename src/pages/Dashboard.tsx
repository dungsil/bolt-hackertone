import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowRight, CreditCard } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { useTransactions } from '@/hooks/useTransactions';
import { useAccounts } from '@/hooks/useAccounts';
import { useDashboard } from '@/hooks/useDashboard';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { transactions, isLoading: isLoadingTransactions } = useTransactions();
  const { accounts, isLoading: isLoadingAccounts } = useAccounts();
  const { summary, isLoading: isLoadingSummary } = useDashboard();

  const isLoading = isLoadingTransactions || isLoadingAccounts || isLoadingSummary;

  const recentTransactions = transactions.slice(0, 5);
  const topAccounts = accounts
    .filter(account => account.type === 'asset' || account.type === 'liability')
    .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.welcome')}</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title={t('dashboard.netWorth')}
          value={formatCurrency(summary.netWorth)}
          icon={<Wallet className="h-6 w-6" />}
        />
        <DashboardCard
          title={t('dashboard.monthlyIncome')}
          value={formatCurrency(summary.monthlyIncome)}
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <DashboardCard
          title={t('dashboard.monthlyExpenses')}
          value={formatCurrency(summary.monthlyExpenses)}
          icon={<TrendingDown className="h-6 w-6" />}
        />
        <DashboardCard
          title={t('dashboard.monthlySavings')}
          value={formatCurrency(summary.monthlySavings)}
          icon={<PiggyBank className="h-6 w-6" />}
        />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t('dashboard.recentTransactions')}</h2>
              <Button variant="link" asChild>
                <Link to="/transactions" className="flex items-center">
                  {t('common.viewAll')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center rounded-md border-2 border-dashed">
                <p className="text-sm text-muted-foreground">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between rounded-md border bg-muted/50 p-3">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date.toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(transaction.entries[0].amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.entries[0].type === 'debit' ? t('transactions.debit') : t('transactions.credit')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Top Accounts */}
        <Card>
          <CardHeader>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t('dashboard.topAccounts')}</h2>
              <Button variant="link" asChild>
                <Link to="/accounts" className="flex items-center">
                  {t('common.viewAll')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {topAccounts.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center rounded-md border-2 border-dashed">
                <p className="text-sm text-muted-foreground">No accounts yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between rounded-md border bg-muted/50 p-3">
                    <div className="flex items-center">
                      <div className="mr-3 rounded-full bg-primary/10 p-2 text-primary">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{account.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t(`accounts.accountTypes.${account.type}`)}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">{t('dashboard.financialSummary')}</h2>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">{t('dashboard.assetsVsLiabilities')}</h3>
              <div className="h-8 w-full overflow-hidden rounded-full bg-muted">
                <div 
                  className="h-full bg-primary" 
                  style={{ 
                    width: `${(summary.totalAssets / (summary.totalAssets + summary.totalLiabilities || 1)) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <div>
                  <p className="font-medium">{t('dashboard.assets')}</p>
                  <p className="text-muted-foreground">{formatCurrency(summary.totalAssets)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{t('dashboard.liabilities')}</p>
                  <p className="text-muted-foreground">{formatCurrency(summary.totalLiabilities)}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">{t('dashboard.incomeVsExpenses')}</h3>
              <div className="h-8 w-full overflow-hidden rounded-full bg-muted">
                <div 
                  className="h-full bg-green-500" 
                  style={{ 
                    width: `${(summary.monthlyIncome / (summary.monthlyIncome + summary.monthlyExpenses || 1)) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <div>
                  <p className="font-medium">{t('dashboard.income')}</p>
                  <p className="text-muted-foreground">{formatCurrency(summary.monthlyIncome)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{t('dashboard.expenses')}</p>
                  <p className="text-muted-foreground">{formatCurrency(summary.monthlyExpenses)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;