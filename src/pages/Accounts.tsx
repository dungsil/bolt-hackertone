import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search } from 'lucide-react';
import { Account } from '../types';
import { accounts as mockAccounts } from '../data/mockData';
import AccountCard from '../components/AccountCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Accounts: React.FC = () => {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<Account['type'] | 'all'>('all');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const filteredAccounts = accounts.filter(account => {
    // Apply search filter
    if (searchTerm && !account.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply type filter
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('accounts.title')}</h1>
          <p className="text-muted-foreground">{t('accounts.subtitle')}</p>
        </div>
        <Button>
          <Plus className="mr-1 h-4 w-4" />
          {t('accounts.addAccount')}
        </Button>
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
          onValueChange={(value) => setFilterType(value as Account['type'] | 'all')}
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
      {filteredAccounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium">{t('accounts.noAccounts')}</p>
            <p className="text-muted-foreground">{t('accounts.tryAdjusting')}</p>
          </CardContent>
        </Card>
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
                    {formatCurrency(selectedAccount.balance, selectedAccount.currency)}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">{t('common.created')}</p>
                <p className="font-medium">
                  {new Date(selectedAccount.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">{t('common.lastUpdated')}</p>
                <p className="font-medium">
                  {new Date(selectedAccount.updatedAt).toLocaleDateString()}
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