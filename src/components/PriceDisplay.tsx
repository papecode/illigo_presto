import { formatPrice } from '@/lib/formatPrice';

interface PriceDisplayProps {
  amount: number;
  unite?: string;
  className?: string;
}

export function PriceDisplay({ amount, unite, className = '' }: PriceDisplayProps) {
  return (
    <span className={`font-semibold ${className}`}>
      {formatPrice(amount)}{unite ? `/${unite}` : ''}
    </span>
  );
}
