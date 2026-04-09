import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getProductImage } from '@/lib/productImages';
import { PriceDisplay } from '@/components/PriceDisplay';
import { QuantitySelector } from '@/components/QuantitySelector';
import { StarRating } from '@/components/StarRating';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { ShoppingCart, MapPin, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function Produit() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [quantite, setQuantite] = useState(1);
  const [reviewNote, setReviewNote] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const { data: produit, isLoading } = useQuery({
    queryKey: ['produit', slug],
    queryFn: async () => {
      const { data } = await supabase.from('produits').select('*').eq('slug', slug).single();
      return data;
    },
  });

  const { data: avis, refetch: refetchAvis } = useQuery({
    queryKey: ['avis', produit?.id],
    queryFn: async () => {
      if (!produit?.id) return [];
      const { data } = await supabase.from('avis').select('*').eq('produit_id', produit.id).order('created_at', { ascending: false });
      return data ?? [];
    },
    enabled: !!produit?.id,
  });

  const { data: similaires } = useQuery({
    queryKey: ['produits-similaires', produit?.categorie_id],
    queryFn: async () => {
      if (!produit) return [];
      const { data } = await supabase.from('produits').select('*').eq('categorie_id', produit.categorie_id).neq('id', produit.id).limit(4);
      return data ?? [];
    },
    enabled: !!produit,
  });

  const handleAddToCart = () => {
    if (!produit) return;
    addItem({ id: produit.id, nom: produit.nom, prix_kg: produit.prix_kg, unite: produit.unite ?? 'kg', image_url: produit.image_url, slug: produit.slug }, quantite);
    toast.success(`${produit.nom} ajouté au panier`);
  };

  const handleSubmitReview = async () => {
    if (!user || !produit || reviewNote === 0) return;
    await supabase.from('avis').insert({ produit_id: produit.id, user_id: user.id, note: reviewNote, commentaire: reviewComment || null });
    toast.success('Avis publié');
    setReviewNote(0);
    setReviewComment('');
    refetchAvis();
  };

  if (isLoading) return <div className="container py-8"><div className="animate-pulse space-y-4"><div className="h-64 bg-muted rounded-lg" /><div className="h-8 bg-muted rounded w-1/2" /></div></div>;
  if (!produit) return <div className="container py-8">Produit non trouvé</div>;

  return (
    <div className="min-h-screen">
      <div className="container py-6">
        <Link to="/boutique" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Retour boutique
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img src={getProductImage(produit.slug, produit.image_url)} alt={produit.nom} className="h-full w-full object-cover" />
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start gap-2 flex-wrap">
              {produit.badge && <Badge className="bg-secondary text-secondary-foreground border-0">{produit.badge}</Badge>}
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold mt-2">
              {produit.nom} {produit.nom_wolof && <span className="text-muted-foreground font-normal text-lg">({produit.nom_wolof})</span>}
            </h1>
            <PriceDisplay amount={produit.prix_kg} unite={produit.unite ?? 'kg'} className="text-xl text-secondary mt-2 block" />

            {produit.provenance && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-secondary" />
                Pêché à {produit.provenance}{produit.pecheur_nom ? ` par ${produit.pecheur_nom}` : ''}
              </div>
            )}

            {produit.note_moyenne && produit.note_moyenne > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <StarRating rating={produit.note_moyenne} />
                <span className="text-xs text-muted-foreground">{produit.note_moyenne}/5</span>
              </div>
            )}

            <div className="mt-6 space-y-4">
              <QuantitySelector value={quantite} onChange={setQuantite} unite={produit.unite ?? 'kg'} />
              <Button onClick={handleAddToCart} size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <ShoppingCart className="mr-2 h-4 w-4" /> Ajouter au panier
              </Button>
            </div>

            {produit.description && (
              <div className="mt-6">
                <h3 className="font-semibold text-sm mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{produit.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold mb-4">Avis clients ({avis?.length ?? 0})</h2>
          
          {user && (
            <div className="mb-6 p-4 rounded-lg border border-border bg-card">
              <h3 className="font-semibold text-sm mb-2">Laisser un avis</h3>
              <StarRating rating={reviewNote} onRate={setReviewNote} size={20} />
              <Textarea placeholder="Votre commentaire..." value={reviewComment} onChange={e => setReviewComment(e.target.value)} className="mt-2" />
              <Button onClick={handleSubmitReview} disabled={reviewNote === 0} size="sm" className="mt-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Publier
              </Button>
            </div>
          )}

          <div className="space-y-3">
            {avis?.map(a => (
              <div key={a.id} className="p-3 rounded-lg border border-border">
                <StarRating rating={a.note} size={14} />
                {a.commentaire && <p className="mt-1 text-sm text-muted-foreground">{a.commentaire}</p>}
              </div>
            ))}
            {(!avis || avis.length === 0) && <p className="text-sm text-muted-foreground">Aucun avis pour le moment</p>}
          </div>
        </section>

        {/* Similar */}
        {similaires && similaires.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-bold mb-4">Produits similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similaires.map((p: any) => <ProductCard key={p.id} {...p} />)}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky add to cart */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-card border-t border-border">
        <Button onClick={handleAddToCart} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          <ShoppingCart className="mr-2 h-4 w-4" /> Ajouter {quantite} {produit.unite ?? 'kg'} — <PriceDisplay amount={produit.prix_kg * quantite} className="ml-1" />
        </Button>
      </div>
    </div>
  );
}
