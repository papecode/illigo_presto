import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { PriceDisplay } from '@/components/PriceDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, RefreshCw } from 'lucide-react';

const quartiers = ['Parcelles Assainies', 'Guédiawaye', 'Pikine', 'Keur Massar', 'Médina', 'Plateau', 'Almadies', 'Ouakam', 'Yoff', 'Grand Dakar', 'Rufisque'];
const statutColors: Record<string, string> = {
  recue: 'bg-blue-100 text-blue-800',
  preparation: 'bg-yellow-100 text-yellow-800',
  livraison: 'bg-orange-100 text-orange-800',
  livree: 'bg-green-100 text-green-800',
  annulee: 'bg-red-100 text-red-800',
};

export default function Compte() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { addItem } = useCart();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [quartier, setQuartier] = useState('');

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setPrenom(profile.prenom ?? '');
      setNom(profile.nom ?? '');
      setTelephone(profile.telephone ?? '');
      setQuartier(profile.quartier ?? '');
    }
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async () => {
      await supabase.from('profiles').update({ prenom, nom, telephone, quartier }).eq('id', user!.id);
    },
    onSuccess: () => { toast.success('Profil mis à jour'); qc.invalidateQueries({ queryKey: ['profile'] }); },
  });

  const { data: commandes } = useQuery({
    queryKey: ['mes-commandes', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('commandes').select('*').eq('user_id', user!.id).order('created_at', { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const handleReorder = async (commandeId: string) => {
    const { data: lignes } = await supabase.from('lignes_commande').select('*, produits(*)').eq('commande_id', commandeId);
    if (lignes) {
      lignes.forEach((l: any) => {
        if (l.produits) {
          addItem({ id: l.produits.id, nom: l.produits.nom, prix_kg: l.produits.prix_kg, unite: l.produits.unite, image_url: l.produits.image_url, slug: l.produits.slug }, l.quantite);
        }
      });
      toast.success('Articles ajoutés au panier');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold">Mon compte</h1>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); nav('/'); }} className="text-muted-foreground">
            <LogOut className="mr-2 h-4 w-4" /> Déconnexion
          </Button>
        </div>

        {/* Profile */}
        <div className="p-4 rounded-lg border border-border bg-card mb-6">
          <h2 className="font-semibold text-sm mb-3">Informations personnelles</h2>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} />
            <Input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} />
            <Input placeholder="Téléphone" value={telephone} onChange={e => setTelephone(e.target.value)} />
            <Select value={quartier} onValueChange={setQuartier}>
              <SelectTrigger><SelectValue placeholder="Quartier" /></SelectTrigger>
              <SelectContent>{quartiers.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button onClick={() => updateProfile.mutate()} size="sm" className="mt-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            Sauvegarder
          </Button>
        </div>

        {/* Orders */}
        <div>
          <h2 className="font-semibold text-sm mb-3">Historique des commandes</h2>
          {commandes && commandes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune commande pour le moment</p>
          ) : (
            <div className="space-y-3">
              {commandes?.map(c => (
                <div key={c.id} className="p-3 rounded-lg border border-border bg-card flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">N° {c.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(c.created_at!).toLocaleDateString('fr-FR')}</p>
                    <Badge className={`mt-1 text-xs ${statutColors[c.statut ?? 'recue']} border-0`}>{c.statut}</Badge>
                  </div>
                  <div className="text-right">
                    <PriceDisplay amount={c.montant_total ?? 0} className="text-sm" />
                    <div className="flex gap-1 mt-1">
                      <Button asChild variant="ghost" size="sm" className="text-xs h-7">
                        <Link to={`/commande/${c.id}`}>Suivre</Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => handleReorder(c.id)}>
                        <RefreshCw className="h-3 w-3 mr-1" /> Recommander
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
