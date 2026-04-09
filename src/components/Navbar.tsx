import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function Navbar() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-lg font-bold text-primary">Illigo Presto</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/boutique" className="text-muted-foreground hover:text-foreground transition-colors">Boutique</Link>
          <Link to="/abonnement" className="text-muted-foreground hover:text-foreground transition-colors">Abonnements</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="hidden md:flex">
            <Link to="/boutique"><Search className="h-4 w-4" /></Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/panier">
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link to={user ? '/compte' : '/auth'}>
              <User className="h-4 w-4" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-2">
          <Link to="/boutique" className="block py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Boutique</Link>
          <Link to="/abonnement" className="block py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Abonnements</Link>
        </div>
      )}
    </header>
  );
}
