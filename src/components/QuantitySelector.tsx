import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unite?: string;
}

export function QuantitySelector({ value, onChange, min = 0.5, max = 50, step = 0.5, unite = 'kg' }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onChange(Math.max(min, value - step))} disabled={value <= min}>
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-16 text-center font-medium text-sm">{value} {unite}</span>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onChange(Math.min(max, value + step))} disabled={value >= max}>
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
