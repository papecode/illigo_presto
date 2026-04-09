import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/ProductCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

export default function Boutique() {
  const { categorie } = useParams();
  const [search, setSearch] = useState('');
  const [tri, setTri] = useState('popularite');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await supabase.from('categories').select('*').order('ordre');
      return data ?? [];
    },
  });

  const { data: produits, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['produits', categorie],
    queryFn: async () => {
      if (categorie) {
        const { data, error: qErr } = await supabase
          .from('produits')
          .select('*, categories!inner(slug)')
          .eq('disponible', true)
          .eq('categories.slug', categorie);
        if (qErr) throw qErr;
        return data ?? [];
      }
      const { data, error: qErr } = await supabase
        .from('produits')
        .select('*, categories(slug)')
        .eq('disponible', true);
      if (qErr) throw qErr;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    let items = produits ?? [];
    if (search) {
      const s = search.toLowerCase();
      items = items.filter((p: any) => p.nom.toLowerCase().includes(s) || p.nom_wolof?.toLowerCase().includes(s));
    }
    if (tri === 'prix-asc') items = [...items].sort((a: any, b: any) => a.prix_kg - b.prix_kg);
    else if (tri === 'prix-desc') items = [...items].sort((a: any, b: any) => b.prix_kg - a.prix_kg);
    else items = [...items].sort((a: any, b: any) => (b.note_moyenne ?? 0) - (a.note_moyenne ?? 0));
    return items;
  }, [produits, search, tri]);

  return (
    <div className="min-h-screen">
      <div className="container py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un produit..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4">
          <Link to="/boutique" className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${!categorie ? 'bg-secondary text-secondary-foreground border-secondary' : 'border-border text-muted-foreground hover:border-secondary'}`}>
            Tous
          </Link>
          {categories?.map(cat => (
            <Link key={cat.id} to={`/boutique/${cat.slug}`} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${categorie === cat.slug ? 'bg-secondary text-secondary-foreground border-secondary' : 'border-border text-muted-foreground hover:border-secondary'}`}>
              {cat.nom}
            </Link>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground">Trier par :</span>
          {[
            { value: 'popularite', label: 'Popularité' },
            { value: 'prix-asc', label: 'Prix ↑' },
            { value: 'prix-desc', label: 'Prix ↓' },
          ].map(t => (
            <button key={t.value} onClick={() => setTri(t.value)} className={`text-xs px-2 py-1 rounded ${tri === t.value ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isError ? (
          <EmptyState
            title="Impossible de charger les produits"
            description={error instanceof Error ? error.message : 'Vérifiez la connexion Supabase et que les tables existent.'}
            actionLabel="Réessayer"
            actionOnClick={() => refetch()}
          />
        ) : isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Aucun produit trouvé"
            description={
              search
                ? "Essayez avec d'autres termes de recherche."
                : 'Le catalogue est vide. Exécutez la migration SQL « seed catalogue » (fichier 20260410140000_seed_catalogue.sql) dans le SQL Editor Supabase.'
            }
            actionLabel="Voir tous les produits"
            actionHref="/boutique"
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p: any) => <ProductCard key={p.id} {...p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
