import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PriceDisplay } from '@/components/PriceDisplay';
import { Link } from 'react-router-dom';

const formules = [
  { id: 'decouverte', name: 'Panier Découverte', prix: 10000, desc: '1kg poisson + 500g fruits', details: 'Idéal pour découvrir nos produits frais chaque semaine' },
  { id: 'famille', name: 'Panier Famille', prix: 20000, desc: '3kg poisson + 1kg fruits + 1 jus', details: 'Le panier parfait pour une famille de 4 personnes' },
  { id: 'premium', name: 'Panier Premium', prix: 35000, desc: '5kg poisson + 2kg fruits + 2 jus + confits', details: 'Notre sélection la plus complète pour les gourmets' },
];

const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function Abonnement() {
  const { user } = useAuth();
  const [selectedFormule, setSelectedFormule] = useState('');
  const [selectedJour, setSelectedJour] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async () => {
    if (!user) { toast.error('Connectez-vous pour vous abonner'); return; }
    setLoading(true);
    try {
      await supabase.from('abonnements').insert({ user_id: user.id, formule: selectedFormule, jour_livraison: selectedJour });
      setSuccess(true);
      toast.success('Abonnement activé !');
    } catch { toast.error('Erreur'); } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="container py-12 text-center max-w-md mx-auto">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary mx-auto mb-4"><Check className="h-8 w-8" /></div>
        <h1 className="font-display text-2xl font-bold">Abonnement activé</h1>
        <p className="mt-2 text-muted-foreground text-sm">Vous recevrez votre premier panier le {selectedJour} prochain.</p>
        <Button asChild className="mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground"><Link to="/compte">Mon compte</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container text-center max-w-xl">
          <h1 className="font-display text-3xl font-bold">Recevez chaque semaine un panier frais</h1>
          <p className="mt-3 opacity-80">Abonnez-vous et recevez automatiquement poisson frais et fruits sauvages à votre porte, chaque semaine.</p>
        </div>
      </section>

      <div className="container py-8 max-w-3xl">
        {/* Formules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {formules.map(f => (
            <button key={f.id} onClick={() => setSelectedFormule(f.id)} className={`p-5 rounded-lg border text-left transition-all ${selectedFormule === f.id ? 'border-secondary bg-secondary/5 ring-2 ring-secondary' : 'border-border hover:border-secondary/50'}`}>
              <h3 className="font-display text-lg font-bold">{f.name}</h3>
              <PriceDisplay amount={f.prix} className="text-secondary text-lg mt-1 block" />
              <p className="text-xs text-muted-foreground mt-1">/semaine</p>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              <p className="mt-1 text-xs text-muted-foreground">{f.details}</p>
            </button>
          ))}
        </div>

        {/* Jour */}
        {selectedFormule && (
          <div className="mb-8">
            <h2 className="font-display text-lg font-bold mb-3">Jour de livraison préféré</h2>
            <div className="flex flex-wrap gap-2">
              {jours.map(j => (
                <button key={j} onClick={() => setSelectedJour(j)} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${selectedJour === j ? 'bg-secondary text-secondary-foreground border-secondary' : 'border-border text-muted-foreground hover:border-secondary'}`}>
                  {j}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedFormule && selectedJour && (
          <Button onClick={handleSubscribe} disabled={loading || !user} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {!user ? "Connectez-vous pour vous abonner" : loading ? 'Activation...' : "S'abonner"}
          </Button>
        )}

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="font-display text-xl font-bold mb-4">Questions fréquentes</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="1"><AccordionTrigger>Comment annuler mon abonnement ?</AccordionTrigger><AccordionContent>Vous pouvez annuler votre abonnement à tout moment depuis votre compte ou en nous contactant via WhatsApp.</AccordionContent></AccordionItem>
            <AccordionItem value="2"><AccordionTrigger>Puis-je modifier ma formule ?</AccordionTrigger><AccordionContent>Oui, vous pouvez changer de formule à tout moment. Le changement sera effectif à partir de la prochaine livraison.</AccordionContent></AccordionItem>
            <AccordionItem value="3"><AccordionTrigger>Puis-je mettre en pause ?</AccordionTrigger><AccordionContent>Oui, contactez-nous via WhatsApp pour mettre en pause ou reprendre votre abonnement.</AccordionContent></AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
