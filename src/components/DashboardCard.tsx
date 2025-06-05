import React, { ReactNode } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  trend,
  className = '',
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
            
            {trend && (
              <div className="mt-2 flex items-center">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive 
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  )}
                >
                  {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                </span>
                <span className="ml-1 text-xs text-muted-foreground">from last month</span>
              </div>
            )}
          </div>
          
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            {icon}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default DashboardCard;