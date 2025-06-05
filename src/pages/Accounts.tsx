import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search } from 'lucide-react';
import { useAccounts } from '@/hooks/useAccounts';
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

  // Group accounts by type
  const groupedAccounts = filteredAccounts.reduce((acc, account) => {
    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, typeof accounts>);

  // Calculate totals for each type
  const totals = accounts.reduce((acc, account) => {
    acc[account.type] = (acc[account.type] || 0) + account.balance;
    return acc;
  }, {} as Record<string, number>);

  const accountTypes = [
    { type: 'asset', label: t('accounts.accountTypes.asset') },
    { type: 'liability', label: t('accounts.accountTypes.liability') },
    { type: 'equity', label: t('accounts.accountTypes.equity') },
    { type: 'revenue', label: t('accounts.accountTypes.revenue') },
    { type: 'expense', label: t('accounts.accountTypes.expense') },
  ];

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
        {accountTypes.map(({ type, label }) => (
          <Card key={type}>
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {label}
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatCurrency(totals[type] || 0, 'USD', i18n.language)}
              </p>
            </CardContent>
          </Card>
        ))}
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
      </div>
      
      {/* Accounts Table */}
      <Card className="overflow-hidden">
        <CardContent className="relative p-0">
          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 rounded-full border-2 border-primary border-t-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading accounts...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-[400px] items-center justify-center p-6">
              <div className="text-center">
                <p className="text-lg font-medium text-destructive">Error loading accounts</p>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="flex h-[400px] items-center justify-center p-6">
              <div className="text-center">
                <p className="text-lg font-medium">{t('accounts.noAccounts')}</p>
                <p className="text-muted-foreground">{t('accounts.tryAdjusting')}</p>
              </div>
            </div>
          ) : (
            <div className="w-full">
              {accountTypes.map(({ type, label }) => {
                const typeAccounts = groupedAccounts[type] || [];
                if (typeAccounts.length === 0) return null;

                return (
                  <div key={type} className="border-b last:border-b-0">
                    <div className="bg-muted/50 p-4">
                      <h3 className="font-semibold">{label}</h3>
                    </div>
                    <div className="divide-y">
                      {typeAccounts.map((account) => (
                        <div
                          key={account.id}
                          className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
                          onClick={() => setSelectedAccount(account)}
                        >
                          <div>
                            <p className="font-medium">{account.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(account.created_at).toLocaleDateString(i18n.language)}
                            </p>
                          </div>
                          <p className={`text-lg font-semibold ${
                            account.balance < 0 ? 'text-red-500' : 'text-green-500'
                          }`}>
                            {formatCurrency(account.balance, account.currency, i18n.language)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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