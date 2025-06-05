import React from 'react';
import { useTranslation } from 'react-i18next';
import { Account } from '../types';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

interface AccountCardProps {
  account: Account;
  onClick?: () => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onClick }) => {
  const { t } = useTranslation();

  const getAccountTypeColor = (type: Account['type']) => {
    switch (type) {
      case 'asset':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100';
      case 'liability':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100';
      case 'equity':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100';
      case 'revenue':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100';
      case 'expense':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100';
    }
  };

  return (
    <Card 
      className={cn("cursor-pointer transition-all hover:shadow-md")}
      onClick={onClick}
    >
      <CardHeader className="space-y-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{account.name}</h3>
            <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium", getAccountTypeColor(account.type))}>
              {t(`accounts.accountTypes.${account.type}`)}
            </span>
          </div>
          <p className="text-xl font-semibold">
            {formatCurrency(account.balance)}
          </p>
        </div>
      </CardHeader>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          {t('common.lastUpdated')}: {new Date(account.updatedAt).toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  );
};

export default AccountCard;