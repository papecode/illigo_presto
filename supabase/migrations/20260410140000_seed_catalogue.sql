-- Données catalogue : catégories + produits (affichage boutique / page d’accueil)
-- Idempotent : ne réinsère pas si le slug existe déjà.

INSERT INTO public.categories (nom, slug, ordre) VALUES
  ('Poissons & mer', 'poissons', 1),
  ('Fruits & jus', 'fruits', 2),
  ('Paniers', 'paniers', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.produits (nom, nom_wolof, slug, description, prix_kg, unite, categorie_id, provenance, pecheur_nom, image_url, stock_kg, disponible, badge, note_moyenne) VALUES
  ('Thiof', 'Cob', 'thiof', 'Thiof frais, selon pêche du jour.', 4500, 'kg', (SELECT id FROM public.categories WHERE slug = 'poissons' LIMIT 1), 'Kayar', NULL, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80', 40, true, 'Du jour', 4.6),
  ('Yaboye', NULL, 'yaboye', 'Yaboye entier glacé.', 3800, 'kg', (SELECT id FROM public.categories WHERE slug = 'poissons' LIMIT 1), 'Saint-Louis', NULL, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80', 25, true, NULL, 4.3),
  ('Sardinelle', NULL, 'sardinelle', 'Sardinelle fraîche, idéale grillée.', 2200, 'kg', (SELECT id FROM public.categories WHERE slug = 'poissons' LIMIT 1), 'Mbour', NULL, 'https://images.unsplash.com/photo-1544943910-4c1dc4aabde7?auto=format&fit=crop&w=900&q=80', 60, true, NULL, 4.4),
  ('Dorade royale', NULL, 'dorade-royale', 'Dorade nettoyée ou entière sur demande.', 6500, 'kg', (SELECT id FROM public.categories WHERE slug = 'poissons' LIMIT 1), 'Casamance', NULL, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80', 18, true, 'Premium', 4.8),
  ('Crevettes de Casamance', NULL, 'crevettes-casamance', 'Crevettes roses, calibre moyen.', 8500, 'kg', (SELECT id FROM public.categories WHERE slug = 'poissons' LIMIT 1), 'Ziguinchor', NULL, 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=80', 15, true, NULL, 4.7),
  ('Madd de Casamance', NULL, 'madd-casamance', 'Mangue mûre à point.', 1500, 'kg', (SELECT id FROM public.categories WHERE slug = 'fruits' LIMIT 1), 'Casamance', NULL, 'https://images.unsplash.com/photo-1605027990121-8728f8d5b7d6?auto=format&fit=crop&w=900&q=80', 80, true, 'Saison', 4.5),
  ('Ditakh', NULL, 'ditakh', 'Ditakh frais (fruit du pain africain / détari).', 2500, 'kg', (SELECT id FROM public.categories WHERE slug = 'fruits' LIMIT 1), 'Niayes', NULL, 'https://images.unsplash.com/photo-1610832958506-aa5636817c94?auto=format&fit=crop&w=900&q=80', 30, true, NULL, 4.2),
  ('Bouye', NULL, 'bouye', 'Fruit du baobab — chair fraîche.', 1800, 'kg', (SELECT id FROM public.categories WHERE slug = 'fruits' LIMIT 1), 'Fatick', NULL, 'https://images.unsplash.com/photo-1599599826927-2e23494d8f85?auto=format&fit=crop&w=900&q=80', 22, true, NULL, 4.1),
  ('Jus de Madd', NULL, 'jus-de-madd', 'Pur jus, sans conservateur.', 800, 'L', (SELECT id FROM public.categories WHERE slug = 'fruits' LIMIT 1), 'Dakar', NULL, 'https://images.unsplash.com/photo-1622597463919-936315e6f0f0?auto=format&fit=crop&w=900&q=80', 100, true, NULL, 4.6),
  ('Confits de ditakh', NULL, 'confits-ditakh', 'Préparation artisanale.', 3500, 'pot', (SELECT id FROM public.categories WHERE slug = 'fruits' LIMIT 1), 'Thiès', NULL, 'https://images.unsplash.com/photo-1558642452-9d2a7bf7f3ad?auto=format&fit=crop&w=900&q=80', 40, true, NULL, 4.4),
  ('Poudre de bouye', NULL, 'poudre-de-bouye', 'À diluer en jus ou smoothies.', 4000, 'kg', (SELECT id FROM public.categories WHERE slug = 'fruits' LIMIT 1), 'Kaolack', NULL, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80', 35, true, NULL, 4.3),
  ('Panier famille', NULL, 'panier-famille', 'Assortiment poisson + légumes (contenu variable).', 12000, 'panier', (SELECT id FROM public.categories WHERE slug = 'paniers' LIMIT 1), 'Dakar', NULL, 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80', 20, true, 'Best-seller', 4.9)
ON CONFLICT (slug) DO NOTHING;
