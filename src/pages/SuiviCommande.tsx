import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { OrderStatusStepper } from '@/components/OrderStatusStepper';
import { PriceDisplay } from '@/components/PriceDisplay';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SuiviCommande() {
  const { id } = useParams();
  const { user } = useAuth();
  const [statut, setStatut] = useState('');

  const { data: commande } = useQuery({
    queryKey: ['commande', id],
    queryFn: async () => {
      const { data } = await supabase.from('commandes').select('*').eq('id', id).single();
      if (data) setStatut(data.statut ?? 'recue');
      return data;
    },
    enabled: !!id,
  });

  const { data: lignes } = useQuery({
    queryKey: ['lignes', id],
    queryFn: async () => {
      const { data } = await supabase.from('lignes_commande').select('*, produits(nom)').eq('commande_id', id);
      return data ?? [];
    },
    enabled: !!id,
  });

  // Realtime subscription
  useEffect(() => {
    if (!id) return;
    const channel = supabase.channel(`commande-${id}`).on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'commandes',
      filter: `id=eq.${id}`,
    }, (payload) => {
      setStatut((payload.new as any).statut);
    }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  if (!commande) return <div className="container py-8 text-center text-muted-foreground">Chargement...</div>;

  const adresse = commande.adresse_livraison as any;

  return (
    <div className="min-h-screen">
      <div className="container py-6 max-w-2xl">
        <h1 className="font-display text-2xl font-bold mb-2">Suivi de commande</h1>
        <p className="text-sm text-muted-foreground mb-6">N° <span className="font-mono">{commande.id.slice(0, 8)}</span></p>

        <OrderStatusStepper statut={statut} />

        <div className="mt-8 space-y-4">
          <div className="p-4 rounded-lg border border-border bg-card">
            <h3 className="font-semibold text-sm mb-2">Détails de livraison</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              {adresse && <p>{adresse.quartier} — {adresse.adresse}</p>}
              <p>Créneau : {commande.creneau_livraison}</p>
              <p>Date : {commande.date_livraison}</p>
              {commande.livreur_nom && <p>Livreur : {commande.livreur_nom}</p>}
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border bg-card">
            <h3 className="font-semibold text-sm mb-2">Articles</h3>
            {lignes?.map((l: any) => (
              <div key={l.id} className="flex justify-between text-sm py-1">
                <span>{l.produits?.nom} x{l.quantite}</span>
                <PriceDisplay amount={l.sous_total} className="text-xs" />
              </div>
            ))}
            <div className="border-t border-border mt-2 pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <PriceDisplay amount={commande.montant_total ?? 0} className="text-secondary" />
            </div>
          </div>

          <div className="flex gap-2">
            {commande.livreur_telephone && (
              <Button asChild variant="outline" className="flex-1">
                <a href={`tel:${commande.livreur_telephone}`}><Phone className="mr-2 h-4 w-4" /> Appeler le livreur</a>
              </Button>
            )}
            <Button asChild variant="outline" className="flex-1">
              <a href="https://wa.me/221770000000" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" /> Support WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
