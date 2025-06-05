import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Filter, Search, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Transaction, Account } from '../types';
import { transactions as mockTransactions, accounts } from '../data/mockData';
import TransactionForm from '../components/TransactionForm';
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

const Transactions: React.FC = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'date' | 'description' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'debit' | 'credit'>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getAccountNameById = (id: string): string => {
    const account = accounts.find(acc => acc.id === id);
    return account ? account.name : 'Unknown Account';
  };

  const handleSort = (field: 'date' | 'description' | 'amount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleAddTransaction = (data: any) => {
    const newTransaction: Transaction = {
      id: `tx-${transactions.length + 1}`,
      date: data.date,
      description: data.description,
      entries: data.entries.map((entry: any, index: number) => ({
        id: `entry-${new Date().getTime()}-${index}`,
        accountId: entry.accountId,
        amount: entry.amount,
        type: entry.type,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTransactions([newTransaction, ...transactions]);
    setIsAddingTransaction(false);
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(searchLower) ||
          transaction.entries.some(entry => 
            getAccountNameById(entry.accountId).toLowerCase().includes(searchLower)
          )
        );
      }
      return true;
    })
    .filter(transaction => {
      if (filterType === 'all') return true;
      return transaction.entries.some(entry => entry.type === filterType);
    })
    .sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortField === 'description') {
        return sortDirection === 'asc'
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description);
      } else if (sortField === 'amount') {
        const aAmount = a.entries[0]?.amount || 0;
        const bAmount = b.entries[0]?.amount || 0;
        return sortDirection === 'asc' ? aAmount - bAmount : bAmount - aAmount;
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('transactions.title')}</h1>
          <p className="text-muted-foreground">{t('transactions.subtitle')}</p>
        </div>
        <Button onClick={() => setIsAddingTransaction(!isAddingTransaction)}>
          <Plus className="mr-1 h-4 w-4" />
          {isAddingTransaction ? t('common.cancel') : t('transactions.addTransaction')}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Transaction Form */}
        <div className={`space-y-6 ${isAddingTransaction ? '' : 'lg:hidden'}`}>
          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-xl font-semibold">{t('transactions.addTransaction')}</h2>
              <TransactionForm
                onSubmit={handleAddTransaction}
                onCancel={() => setIsAddingTransaction(false)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('transactions.searchTransactions')}
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select
                value={filterType}
                onValueChange={(value) => setFilterType(value as 'all' | 'debit' | 'credit')}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('transactions.type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('accounts.accountTypes.all')}</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => handleSort('date')}
              >
                {t('transactions.date')}
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSort('description')}
              >
                {t('transactions.description')}
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSort('amount')}
              >
                {t('transactions.amount')}
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-lg font-medium">{t('transactions.noTransactions')}</p>
                  <p className="text-muted-foreground">{t('transactions.tryAdjusting')}</p>
                </CardContent>
              </Card>
            ) : (
              filteredTransactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{transaction.description}</h3>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          ID: {transaction.id}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          {formatCurrency(transaction.entries[0].amount)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.entries[0].type === 'debit' ? 'Debit' : 'Credit'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-3 rounded-md border bg-muted p-3">
                      <h4 className="text-sm font-medium">{t('transactions.transactionEntries')}</h4>
                      
                      <div className="space-y-2">
                        {transaction.entries.map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between rounded-md bg-background p-2 text-sm">
                            <span>{getAccountNameById(entry.accountId)}</span>
                            <div className="flex items-center gap-2">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                entry.type === 'debit' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 
                                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
                              }`}>
                                {entry.type}
                              </span>
                              <span className="font-medium">{formatCurrency(entry.amount)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <p>{t('common.created')}: {new Date(transaction.createdAt).toLocaleString()}</p>
                        <p>{t('common.lastUpdated')}: {new Date(transaction.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;