import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search } from 'lucide-react';
import { useAccounts } from '@/hooks/useAccounts';
import AccountForm from '../components/AccountForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { formatCurrency } from '@/lib/utils';

const Accounts: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { accounts, isLoading, error, refetch } = useAccounts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<typeof accounts[0] | null>(null);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);

  const filteredAccounts = accounts.filter(account => {
    if (searchTerm && !account.name.toLowerCase().includes(searchTerm.toLowerCase())) {
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

  const handleEditAccount = async () => {
    await refetch();
    setIsEditingAccount(false);
    setSelectedAccount(null);
  };

  const handleEditClick = (account: typeof accounts[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAccount(account);
    setIsEditingAccount(true);
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
                {formatCurrency(totals[type] || 0)}
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
      
      {/* Accounts Tables */}
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
        <div className="grid gap-6">
          {accountTypes.map(({ type, label }) => {
            const typeAccounts = groupedAccounts[type] || [];
            if (typeAccounts.length === 0) return null;

            return (
              <Card key={type}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('common.total')}: {formatCurrency(totals[type] || 0)}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-4 font-medium">{t('accounts.name')}</th>
                          <th className="text-left p-4 font-medium">{t('accounts.description')}</th>
                          <th className="text-right p-4 font-medium">{t('accounts.currency')}</th>
                          <th className="text-right p-4 font-medium">{t('accounts.balance')}</th>
                          <th className="text-right p-4 font-medium">{t('common.actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {typeAccounts.map((account) => (
                          <tr key={account.id} className="group hover:bg-muted/50">
                            <td className="p-4">
                              <HoverCard>
                                <HoverCardTrigger className="font-medium hover:text-primary cursor-pointer">
                                  {account.name}
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                  <div className="space-y-2">
                                    <h4 className="font-medium">{account.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {account.description || t('accounts.noDescription')}
                                    </p>
                                    <div className="pt-2">
                                      <p className="text-sm text-muted-foreground">
                                        {t('common.created')}: {new Date(account.created_at).toLocaleDateString()}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {t('common.lastUpdated')}: {new Date(account.updated_at).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            </td>
                            <td className="p-4">
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {account.description || t('accounts.noDescription')}
                              </p>
                            </td>
                            <td className="p-4 text-right">
                              <span className="text-sm font-medium">{account.currency}</span>
                            </td>
                            <td className="p-4 text-right">
                              <span className={`font-medium ${
                                account.balance < 0 ? 'text-red-500' : 'text-green-500'
                              }`}>
                                {formatCurrency(account.balance)}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleEditClick(account, e)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                {t('common.edit')}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
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
      
      {/* Edit Account Dialog */}
      <Dialog open={isEditingAccount} onOpenChange={(open) => {
        setIsEditingAccount(open);
        if (!open) setSelectedAccount(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('accounts.editAccount')}</DialogTitle>
          </DialogHeader>
          {selectedAccount && (
            <AccountForm
              initialData={{
                id: selectedAccount.id,
                name: selectedAccount.name,
                type: selectedAccount.type,
                description: selectedAccount.description,
                currency: selectedAccount.currency,
              }}
              onSubmit={handleEditAccount}
              onCancel={() => {
                setIsEditingAccount(false);
                setSelectedAccount(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Accounts;