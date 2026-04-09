import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from './PriceDisplay';
import { useCart } from '@/contexts/CartContext';
import { getProductImage } from '@/lib/productImages';

interface ProductCardProps {
  id: number;
  nom: string;
  slug: string;
  prix_kg: number;
  unite: string;
  image_url: string | null;
  badge?: string | null;
  provenance?: string | null;
  note_moyenne?: number;
}

export function ProductCard({ id, nom, slug, prix_kg, unite, image_url, badge, provenance }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, nom, prix_kg, unite, image_url, slug });
  };

  return (
    <Link to={`/produit/${slug}`} className="group block">
      <div className="overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={getProductImage(slug, image_url)}
            alt={nom}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {badge && (
            <Badge className="absolute left-2 top-2 bg-secondary text-secondary-foreground border-0 text-xs">
              {badge}
            </Badge>
          )}
          {provenance && (
            <Badge variant="outline" className="absolute right-2 top-2 bg-card/80 backdrop-blur-sm text-xs border-0">
              {provenance}
            </Badge>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm text-card-foreground line-clamp-1">{nom}</h3>
          <div className="mt-1 flex items-center justify-between">
            <PriceDisplay amount={prix_kg} unite={unite} className="text-sm text-secondary" />
            <Button size="icon" variant="outline" className="h-8 w-8 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground" onClick={handleAdd}>
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
