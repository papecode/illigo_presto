import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import heroBg from '@/assets/hero-bg.jpg';
import { ProductCard } from '@/components/ProductCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { Button } from '@/components/ui/button';
import { Fish, Leaf, Truck, Shield, ArrowRight, Package, CreditCard } from 'lucide-react';

export default function Index() {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await supabase.from('categories').select('*').order('ordre');
      return data ?? [];
    },
  });

  const { data: produits, isLoading } = useQuery({
    queryKey: ['produits-featured'],
    queryFn: async () => {
      const { data } = await supabase.from('produits').select('*').eq('disponible', true).order('note_moyenne', { ascending: false }).limit(8);
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" width={1920} height={800} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        <div className="container relative z-10 py-16 md:py-24">
          <div className="max-w-xl">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground leading-tight">
              Du pêcheur à votre table
            </h1>
            <p className="mt-4 text-primary-foreground/80 text-base md:text-lg">
              Poisson frais et fruits sauvages livrés chez vous à Dakar. Qualité garantie, directement des pêcheurs de Kayar, Joal et Mbour.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                <Link to="/boutique">Commander maintenant <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/abonnement">Nos abonnements</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-border">
        <div className="container">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories?.map(cat => (
              <Link key={cat.id} to={`/boutique/${cat.slug}`} className="flex-shrink-0 px-4 py-2 rounded-full border border-border bg-card text-sm font-medium text-muted-foreground hover:border-secondary hover:text-secondary transition-colors">
                {cat.nom}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-10">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">Produits du jour</h2>
            <Button variant="ghost" asChild className="text-secondary">
              <Link to="/boutique">Voir tout <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />) : 
              produits?.map(p => <ProductCard key={p.id} {...p} />)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 bg-muted/50">
        <div className="container">
          <h2 className="font-display text-2xl font-bold text-center text-foreground mb-8">Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Fish, title: 'Choisissez', desc: 'Parcourez notre sélection de poissons frais et fruits sauvages du Sénégal' },
              { icon: CreditCard, title: 'Payez par Wave/OM', desc: 'Paiement simple et sécurisé via Wave, Orange Money ou Free Money' },
              { icon: Truck, title: 'Livré en 2h', desc: 'Votre commande livrée fraîche à votre porte dans les 2 heures' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-4">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Illigo */}
      <section className="py-12">
        <div className="container">
          <h2 className="font-display text-2xl font-bold text-center text-foreground mb-8">Pourquoi Illigo Presto</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Fish, title: 'Fraîcheur garantie', desc: 'Pêché le matin, livré le jour même' },
              { icon: Shield, title: 'Traçabilité', desc: 'Connaissez le pêcheur et le lieu de pêche' },
              { icon: Truck, title: 'Livraison rapide', desc: 'En 2h dans tout Dakar' },
              { icon: Leaf, title: 'Prix équitables', desc: 'Juste rémunération des pêcheurs' },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-lg border border-border bg-card text-center">
                <item.icon className="h-8 w-8 text-secondary mx-auto mb-3" />
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container">
          <h2 className="font-display text-2xl font-bold text-center mb-8">Nos pêcheurs partenaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Moussa Diop', location: 'Kayar', quote: 'Grâce à Illigo Presto, je vends mon poisson directement aux familles de Dakar à un prix juste.' },
              { name: 'Ibrahima Sène', location: 'Joal', quote: 'La plateforme nous permet de réduire les pertes et d\'assurer un revenu stable pour nos familles.' },
              { name: 'Abdoulaye Ndiaye', location: 'Mbour', quote: 'Je suis fier que mon poisson arrive frais sur les tables des ménages dakarois.' },
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10">
                <p className="text-sm italic opacity-90">"{t.quote}"</p>
                <div className="mt-4">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs opacity-70">Pêcheur à {t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="container text-center">
          <h2 className="font-display text-2xl font-bold">Prêt à commander ?</h2>
          <p className="mt-2 text-muted-foreground">Découvrez notre sélection de produits frais du Sénégal</p>
          <Button asChild size="lg" className="mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <Link to="/boutique">Explorer la boutique</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
