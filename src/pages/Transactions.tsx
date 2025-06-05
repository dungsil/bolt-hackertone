import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Filter, Search, ArrowUpDown, ChevronDown } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
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
import { formatCurrency } from '@/lib/utils';

const Transactions: React.FC = () => {
  const { t } = useTranslation();
  const { transactions, isLoading, error, createTransaction } = useTransactions();
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'date' | 'description' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'debit' | 'credit'>('all');

  const handleSort = (field: 'date' | 'description' | 'amount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleAddTransaction = async (data: any) => {
    try {
      await createTransaction(data);
      setIsAddingTransaction(false);
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(searchLower) ||
          transaction.entries.some(entry => 
            entry.account.name.toLowerCase().includes(searchLower)
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
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
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
        <Button onClick={() => setIsAddingTransaction(true)}>
          <Plus className="mr-1 h-4 w-4" />
          {t('transactions.addTransaction')}
        </Button>
      </div>
      
      {isAddingTransaction ? (
        <Card>
          <CardContent className="pt-6">
            <h2 className="mb-4 text-xl font-semibold">{t('transactions.addTransaction')}</h2>
            <TransactionForm
              onSubmit={handleAddTransaction}
              onCancel={() => setIsAddingTransaction(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-64">
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
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => handleSort('date')}
              >
                Date
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSort('description')}
              >
                Description
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSort('amount')}
              >
                Amount
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <Card className="overflow-hidden">
            <CardContent className="relative min-h-[400px] p-0">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 rounded-full border-2 border-primary border-t-transparent"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading transactions...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex h-full min-h-[400px] items-center justify-center p-6">
                  <div className="text-center">
                    <p className="text-lg font-medium text-destructive">Error loading transactions</p>
                    <p className="text-muted-foreground">{error}</p>
                  </div>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="flex h-full min-h-[400px] items-center justify-center p-6">
                  <div className="text-center">
                    <p className="text-lg font-medium">{t('transactions.noTransactions')}</p>
                    <p className="text-muted-foreground">{t('transactions.tryAdjusting')}</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-4">
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{transaction.description}</h3>
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              {transaction.date.toLocaleDateString()}
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
                      
                      <details className="mt-4 group">
                        <summary className="list-none cursor-pointer text-sm font-medium text-primary hover:text-primary/90 flex items-center">
                          <span>{t('transactions.viewDetails')}</span>
                          <ChevronDown className="ml-1 h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        
                        <div className="mt-3 space-y-3 rounded-md border bg-muted p-3">
                          <h4 className="text-sm font-medium">{t('transactions.transactionEntries')}</h4>
                          
                          <div className="space-y-2">
                            {transaction.entries.map((entry) => (
                              <div key={entry.id} className="flex items-center justify-between rounded-md bg-background p-2 text-sm">
                                <span>{entry.account.name}</span>
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
                            <p>Created: {transaction.createdAt.toLocaleString()}</p>
                            <p>Last Updated: {transaction.updatedAt.toLocaleString()}</p>
                          </div>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Transactions;