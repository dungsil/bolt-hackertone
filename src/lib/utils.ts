import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import i18n from '@/i18n';
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  const locale = i18n.language === 'ko' ? 'ko-KR' : 'en-US';
  const currency = i18n.language === 'ko' ? 'KRW' : 'USD';
  
  // Convert USD to KRW for Korean locale
  const convertedAmount = currency === 'KRW' ? Math.round(amount * 1300) : amount;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
    maximumFractionDigits: currency === 'KRW' ? 0 : 2,
  }).format(convertedAmount);
}