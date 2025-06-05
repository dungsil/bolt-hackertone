import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search } from 'lucide-react';
import { useAccounts } from '@/hooks/useAccounts';
import AccountCard from '../components/AccountCard';
import AccountForm from '../components/AccountForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils';

const Accounts: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { accounts, isLoading, error, refetch } = useAccounts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'>('all');
  const [selectedAccount, setSelectedAccount] = useState<typeof accounts[0] | null>(null);
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  const filteredAccounts = accounts.filter(account => {
    if (searchTerm && !account.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filterType !== 'all' && account.type !== filterType) {
      return false;
    }
    return true;
  });

  const accountTypeOptions = [
    { value: 'all', label: t('accounts.accountTypes.all') },
    { value: 'asset', label: t('accounts.accountTypes.asset') },
    { value: 'liability', label: t('accounts.accountTypes.liability') },
    { value: 'equity', label: t('accounts.accountTypes.equity') },
    { value: 'revenue', label: t('accounts.accountTypes.revenue') },
    { value: 'expense', label: t('accounts.accountTypes.expense') },
  ];

  // Calculate totals
  const totals = accounts.reduce((acc, account) => {
    acc[account.type] = (acc[account.type] || 0) + account.balance;
    return acc;
  }, {} as Record<string, number>);

  const handleAddAccount = async () => {
    await refetch();
    setIsAddingAccount(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('accounts.title')}</h1>
          <p className="text-muted-foreground">{t('accounts.subtitle')}</p>
        </div>
        <Button onClick={() => setIsAddingAccount(true)}>
          <Plus className="mr-1 h-4 w-4" />
          {t('accounts.addAccount')}
        </Button>
      </div>

      {/* Account Summary Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('accounts.accountTypes.asset')}
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(totals.asset || 0, 'USD', i18n.language)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('accounts.accountTypes.liability')}
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(totals.liability || 0, 'USD', i18n.language)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('accounts.accountTypes.equity')}
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(totals.equity || 0, 'USD', i18n.language)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('accounts.accountTypes.revenue')}
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(totals.revenue || 0, 'USD', i18n.language)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('accounts.accountTypes.expense')}
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(totals.expense || 0, 'USD', i18n.language)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('accounts.searchAccounts')}
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select
          value={filterType}
          onValueChange={(value) => setFilterType(value as typeof filterType)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('accounts.accountTypes.all')} />
          </SelectTrigger>
          <SelectContent>
            {accountTypeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Accounts Grid */}
      <Card className="overflow-hidden">
        <CardContent className="relative min-h-[400px] p-6">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 rounded-full border-2 border-primary border-t-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading accounts...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-full min-h-[400px] items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-medium text-destructive">Error loading accounts</p>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="flex h-full min-h-[400px] items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-medium">{t('accounts.noAccounts')}</p>
                <p className="text-muted-foreground">{t('accounts.tryAdjusting')}</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAccounts.map((account) => (
                <AccountCard 
                  key={account.id} 
                  account={account} 
                  onClick={() => setSelectedAccount(account)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Account Dialog */}
      <Dialog open={isAddingAccount} onOpenChange={setIsAddingAccount}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('accounts.addAccount')}</DialogTitle>
          </DialogHeader>
          <AccountForm
            onSubmit={handleAddAccount}
            onCancel={() => setIsAddingAccount(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Account Details Dialog */}
      <Dialog open={selectedAccount !== null} onOpenChange={() => setSelectedAccount(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAccount?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedAccount && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('transactions.type')}</p>
                  <p className="font-medium capitalize">{t(`accounts.accountTypes.${selectedAccount.type}`)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('transactions.amount')}</p>
                  <p className="font-medium">
                    {formatCurrency(selectedAccount.balance, selectedAccount.currency, i18n.language)}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">{t('common.created')}</p>
                <p className="font-medium">
                  {selectedAccount.created_at.toLocaleDateString(i18n.language)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">{t('common.lastUpdated')}</p>
                <p className="font-medium">
                  {selectedAccount.updated_at.toLocaleDateString(i18n.language)}
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedAccount(null)}>
                  {t('common.close')}
                </Button>
                <Button>
                  {t('common.edit')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Accounts;