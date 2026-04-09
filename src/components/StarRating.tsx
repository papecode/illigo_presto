import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRate?: (rating: number) => void;
  size?: number;
}

export function StarRating({ rating, maxRating = 5, onRate, size = 16 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }, (_, i) => (
        <Star
          key={i}
          className={`${onRate ? 'cursor-pointer' : ''} ${i < Math.round(rating) ? 'fill-sand text-sand' : 'text-muted-foreground/30'}`}
          style={{ width: size, height: size }}
          onClick={() => onRate?.(i + 1)}
        />
      ))}
    </div>
  );
}
