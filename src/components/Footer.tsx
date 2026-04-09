import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-lg font-bold mb-3">Illigo Presto</h3>
            <p className="text-sm opacity-80">Du pêcheur à votre table. Poisson frais et fruits sauvages livrés chez vous à Dakar.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Navigation</h4>
            <div className="space-y-2 text-sm opacity-80">
              <Link to="/boutique" className="block hover:opacity-100">Boutique</Link>
              <Link to="/abonnement" className="block hover:opacity-100">Abonnements</Link>
              <Link to="/compte" className="block hover:opacity-100">Mon Compte</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Informations</h4>
            <div className="space-y-2 text-sm opacity-80">
              <p>Livraison à Dakar</p>
              <p>Paiement Wave, OM, Free Money</p>
              <p>Frais de livraison : 1 000 FCFA</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Contact</h4>
            <a href="https://wa.me/221770000000" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-primary-foreground/20 text-center text-xs opacity-60">
          © {new Date().getFullYear()} Illigo Presto. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
