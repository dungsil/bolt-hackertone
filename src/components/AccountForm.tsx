import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AccountFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  initialData?: {
    id: string;
    name: string;
    type: string;
    description?: string;
    currency: string;
  };
}

const AccountForm: React.FC<AccountFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || '',
    description: initialData?.description || '',
    currency: initialData?.currency || (i18n.language === 'ko' ? 'KRW' : 'USD'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (initialData?.id) {
        // Update existing account
        const { error: accountError } = await supabase
          .from('accounts')
          .update({
            name: formData.name,
            description: formData.description,
            currency: formData.currency,
          })
          .eq('id', initialData.id)
          .eq('user_id', user.id);

        if (accountError) throw accountError;
      } else {
        // Create new account
        const { error: accountError } = await supabase
          .from('accounts')
          .insert({
            user_id: user.id,
            name: formData.name,
            type: formData.type,
            description: formData.description,
            currency: formData.currency,
            balance: 0,
          });

        if (accountError) throw accountError;
      }
      
      onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">{t('accounts.name')}</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      {!initialData && (
        <div className="space-y-2">
          <Label htmlFor="type">{t('accounts.type')}</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('accounts.selectType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asset">{t('accounts.accountTypes.asset')}</SelectItem>
              <SelectItem value="liability">{t('accounts.accountTypes.liability')}</SelectItem>
              <SelectItem value="equity">{t('accounts.accountTypes.equity')}</SelectItem>
              <SelectItem value="revenue">{t('accounts.accountTypes.revenue')}</SelectItem>
              <SelectItem value="expense">{t('accounts.accountTypes.expense')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">{t('accounts.description')}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder={t('accounts.descriptionPlaceholder')}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currency">{t('accounts.currency')}</Label>
        <Select
          value={formData.currency}
          onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="KRW">KRW</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          {t('common.cancel')}
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </form>
  );
};

export default AccountForm;