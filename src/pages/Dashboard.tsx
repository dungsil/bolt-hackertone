import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, TrendingDown, DollarSign, PiggyBank, CreditCard, ArrowRight } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { dashboardSummary, transactions, accounts } from '../data/mockData';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const recentTransactions = transactions.slice(0, 5);
  const topAccounts = accounts.filter(account => account.type === 'asset' || account.type === 'liability').slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your financial overview</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Net Worth"
          value={formatCurrency(dashboardSummary.netWorth)}
          icon={<Wallet className="h-6 w-6" />}
          trend={{ value: 5.2, isPositive: true }}
        />
        <DashboardCard
          title="Monthly Income"
          value={formatCurrency(dashboardSummary.monthlyIncome)}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: 2.1, isPositive: true }}
        />
        <DashboardCard
          title="Monthly Expenses"
          value={formatCurrency(dashboardSummary.monthlyExpenses)}
          icon={<TrendingDown className="h-6 w-6" />}
          trend={{ value: 1.5, isPositive: false }}
        />
        <DashboardCard
          title="Monthly Savings"
          value={formatCurrency(dashboardSummary.monthlySavings)}
          icon={<PiggyBank className="h-6 w-6" />}
          trend={{ value: 8.3, isPositive: true }}
        />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <Button variant="link" asChild>
                <Link to="/transactions" className="flex items-center">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between rounded-md border bg-muted/50 p-3">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(transaction.entries[0].amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.entries[0].type === 'debit' ? 'Debit' : 'Credit'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Top Accounts */}
        <Card>
          <CardHeader>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Top Accounts</h2>
              <Button variant="link" asChild>
                <Link to="/accounts" className="flex items-center">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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
                        {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(account.balance)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Financial Summary</h2>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Assets vs Liabilities</h3>
              <div className="h-8 w-full overflow-hidden rounded-full bg-muted">
                <div 
                  className="h-full bg-primary" 
                  style={{ 
                    width: `${(dashboardSummary.totalAssets / (dashboardSummary.totalAssets + dashboardSummary.totalLiabilities)) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <div>
                  <p className="font-medium">Assets</p>
                  <p className="text-muted-foreground">{formatCurrency(dashboardSummary.totalAssets)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Liabilities</p>
                  <p className="text-muted-foreground">{formatCurrency(dashboardSummary.totalLiabilities)}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Income vs Expenses</h3>
              <div className="h-8 w-full overflow-hidden rounded-full bg-muted">
                <div 
                  className="h-full bg-green-500" 
                  style={{ 
                    width: `${(dashboardSummary.monthlyIncome / (dashboardSummary.monthlyIncome + dashboardSummary.monthlyExpenses)) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <div>
                  <p className="font-medium">Income</p>
                  <p className="text-muted-foreground">{formatCurrency(dashboardSummary.monthlyIncome)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Expenses</p>
                  <p className="text-muted-foreground">{formatCurrency(dashboardSummary.monthlyExpenses)}</p>
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