import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/db';

interface Account {
  id: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
}

interface TransactionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [accountsList, setAccountsList] = useState<Account[]>([]);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  const [entries, setEntries] = useState<Array<{ accountId: string; amount: string; type: 'debit' | 'credit' }>>([
    { accountId: '', amount: '', type: 'debit' },
    { accountId: '', amount: '', type: 'credit' },
  ]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('accounts')
          .select('id, name, type')
          .eq('user_id', user.id);

        if (error) throw error;
        setAccountsList(data);
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  const handleEntryChange = (index: number, field: string, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    
    if (field === 'type') {
      const otherIndex = index === 0 ? 1 : 0;
      newEntries[otherIndex] = { 
        ...newEntries[otherIndex], 
        type: value === 'debit' ? 'credit' : 'debit' 
      };
    }
    
    if (field === 'amount') {
      const otherIndex = index === 0 ? 1 : 0;
      newEntries[otherIndex] = { 
        ...newEntries[otherIndex], 
        amount: value 
      };
    }
    
    setEntries(newEntries);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedEntries = entries.map(entry => ({
      ...entry,
      amount: parseFloat(entry.amount),
    }));
    
    onSubmit({
      date,
      description,
      entries: formattedEntries,
    });
  };

  const isFormValid = () => {
    return (
      date &&
      description &&
      entries.every(entry => entry.accountId && entry.amount && parseFloat(entry.amount) > 0)
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">{t('transactions.date')}</Label>
          <Input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">{t('transactions.description')}</Label>
          <Input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('transactions.description')}
            required
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t('transactions.transactionEntries')}</h3>
        
        {entries.map((entry, index) => (
          <Card key={index} className="p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`account-${index}`}>{t('transactions.account')}</Label>
                <Select
                  value={entry.accountId}
                  onValueChange={(value) => handleEntryChange(index, 'accountId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('transactions.account')} />
                  </SelectTrigger>
                  <SelectContent>
                    {accountsList.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({t(`accounts.accountTypes.${account.type}`)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`amount-${index}`}>{t('transactions.amount')}</Label>
                <Input
                  type="number"
                  id={`amount-${index}`}
                  value={entry.amount}
                  onChange={(e) => handleEntryChange(index, 'amount', e.target.value)}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`type-${index}`}>{t('transactions.type')}</Label>
                <Select
                  value={entry.type}
                  onValueChange={(value) => handleEntryChange(index, 'type', value as 'debit' | 'credit')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debit">Debit</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          {t('common.cancel')}
        </Button>
        <Button
          type="submit"
          disabled={!isFormValid()}
        >
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;