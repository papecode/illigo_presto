import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { PriceDisplay } from '@/components/PriceDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Check, MessageCircle } from 'lucide-react';

const quartiers = ['Parcelles Assainies', 'Guédiawaye', 'Pikine', 'Keur Massar', 'Médina', 'Plateau', 'Almadies', 'Ouakam', 'Yoff', 'Grand Dakar', 'Rufisque'];
const creneaux = ['9h-11h', '11h-13h', '14h-16h', '16h-18h'];
const paiements = [
  { id: 'wave', name: 'Wave' },
  { id: 'orange-money', name: 'Orange Money' },
  { id: 'free-money', name: 'Free Money' },
];

export default function Checkout() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, fraisLivraison, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [quartier, setQuartier] = useState('');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [dateLivraison, setDateLivraison] = useState<'aujourdhui' | 'demain'>('aujourdhui');
  const [creneau, setCreneau] = useState('');
  const [paiement, setPaiement] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);

  if (items.length === 0 && !confirmationId) {
    return <div className="container py-8 text-center"><p className="text-muted-foreground">Votre panier est vide</p><Button asChild className="mt-4"><Link to="/boutique">Explorer la boutique</Link></Button></div>;
  }

  if (confirmationId) {
    return (
      <div className="container py-12 text-center max-w-md mx-auto">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary mx-auto mb-4">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="font-display text-2xl font-bold">Commande confirmée</h1>
        <p className="mt-2 text-muted-foreground text-sm">Numéro de commande : <span className="font-mono font-medium text-foreground">{confirmationId.slice(0, 8)}</span></p>
        <p className="mt-1 text-muted-foreground text-sm">Livraison {dateLivraison === 'aujourdhui' ? "aujourd'hui" : 'demain'} ({creneau})</p>
        <div className="mt-6 flex flex-col gap-2">
          <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <Link to={`/commande/${confirmationId}`}>Suivre ma commande</Link>
          </Button>
          <Button asChild variant="outline">
            <a href="https://wa.me/221770000000" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp pour le suivi
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const handleConfirm = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const date = new Date();
      if (dateLivraison === 'demain') date.setDate(date.getDate() + 1);

      const { data: commande, error } = await supabase.from('commandes').insert({
        user_id: user.id,
        adresse_livraison: { quartier, adresse, telephone },
        creneau_livraison: creneau,
        date_livraison: date.toISOString().split('T')[0],
        montant_total: total,
        frais_livraison: fraisLivraison,
        mode_paiement: paiement,
      }).select().single();

      if (error) throw error;

      await supabase.from('lignes_commande').insert(
        items.map(item => ({
          commande_id: commande.id,
          produit_id: item.id,
          quantite: item.quantite,
          prix_unitaire: item.prix_kg,
          sous_total: item.prix_kg * item.quantite,
        }))
      );

      setConfirmationId(commande.id);
      clearCart();
      toast.success('Commande confirmée !');
    } catch (err) {
      toast.error('Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container py-6 max-w-2xl">
        <h1 className="font-display text-2xl font-bold mb-6">Passer la commande</h1>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {['Adresse', 'Créneau', 'Paiement'].map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step > i + 1 ? 'bg-secondary text-secondary-foreground' : step === i + 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-xs font-medium hidden sm:inline">{label}</span>
              {i < 2 && <div className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-secondary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <Select value={quartier} onValueChange={setQuartier}>
              <SelectTrigger><SelectValue placeholder="Quartier" /></SelectTrigger>
              <SelectContent>{quartiers.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
            </Select>
            <Input placeholder="Rue / Repère" value={adresse} onChange={e => setAdresse(e.target.value)} />
            <Input placeholder="Téléphone" value={telephone} onChange={e => setTelephone(e.target.value)} />
            <Button onClick={() => setStep(2)} disabled={!quartier || !adresse || !telephone} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Continuer
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex gap-2">
              {(['aujourdhui', 'demain'] as const).map(d => (
                <button key={d} onClick={() => setDateLivraison(d)} className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${dateLivraison === d ? 'bg-secondary text-secondary-foreground border-secondary' : 'border-border text-muted-foreground hover:border-secondary'}`}>
                  {d === 'aujourdhui' ? "Aujourd'hui" : 'Demain'}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {creneaux.map(c => (
                <button key={c} onClick={() => setCreneau(c)} className={`py-3 rounded-lg border text-sm font-medium transition-colors ${creneau === c ? 'bg-secondary text-secondary-foreground border-secondary' : 'border-border text-muted-foreground hover:border-secondary'}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Retour</Button>
              <Button onClick={() => setStep(3)} disabled={!creneau} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">Continuer</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {paiements.map(p => (
                <button key={p.id} onClick={() => setPaiement(p.id)} className={`py-4 px-4 rounded-lg border text-left transition-colors ${paiement === p.id ? 'bg-secondary text-secondary-foreground border-secondary' : 'border-border text-foreground hover:border-secondary'}`}>
                  <span className="font-medium">{p.name}</span>
                </button>
              ))}
            </div>

            {/* Summary */}
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold text-sm mb-2">Récapitulatif</h3>
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1">
                  <span className="text-muted-foreground">{item.nom} x{item.quantite}</span>
                  <PriceDisplay amount={item.prix_kg * item.quantite} className="text-xs" />
                </div>
              ))}
              <div className="border-t border-border mt-2 pt-2 flex justify-between text-sm"><span className="text-muted-foreground">Livraison</span><PriceDisplay amount={fraisLivraison} className="text-xs" /></div>
              <div className="flex justify-between font-semibold mt-1"><span>Total</span><PriceDisplay amount={total} className="text-secondary" /></div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Retour</Button>
              <Button onClick={handleConfirm} disabled={!paiement || loading} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                {loading ? 'Confirmation...' : 'Confirmer la commande'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
