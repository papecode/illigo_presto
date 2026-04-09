import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { getProductImage } from '@/lib/productImages';
import { PriceDisplay } from '@/components/PriceDisplay';
import { QuantitySelector } from '@/components/QuantitySelector';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function Panier() {
  const { items, updateQuantity, removeItem, subtotal, fraisLivraison, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-8">
        <EmptyState title="Votre panier est vide" description="Ajoutez des produits frais pour commencer votre commande" actionLabel="Explorer la boutique" actionHref="/boutique" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container py-6">
        <h1 className="font-display text-2xl font-bold mb-6">Mon panier</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex gap-3 p-3 rounded-lg border border-border bg-card">
                <img src={getProductImage(item.slug, item.image_url)} alt={item.nom} className="h-20 w-20 rounded-md object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{item.nom}</h3>
                  <PriceDisplay amount={item.prix_kg} unite={item.unite} className="text-sm text-secondary" />
                  <div className="mt-2 flex items-center justify-between">
                    <QuantitySelector value={item.quantite} onChange={v => updateQuantity(item.id, v)} unite={item.unite} />
                    <div className="flex items-center gap-2">
                      <PriceDisplay amount={item.prix_kg * item.quantite} className="text-sm font-semibold" />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg border border-border bg-card h-fit sticky top-20">
            <h2 className="font-display text-lg font-semibold mb-4">Résumé</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><PriceDisplay amount={subtotal} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><PriceDisplay amount={fraisLivraison} /></div>
              <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
                <span>Total</span><PriceDisplay amount={total} className="text-secondary" />
              </div>
            </div>
            <Button asChild className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/checkout">Passer la commande</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
