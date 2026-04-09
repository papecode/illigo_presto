
-- Categories table
CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  ordre INT DEFAULT 0
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Produits table
CREATE TABLE public.produits (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  nom_wolof TEXT,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  prix_kg INT NOT NULL,
  unite TEXT DEFAULT 'kg',
  categorie_id INT REFERENCES public.categories(id),
  provenance TEXT,
  pecheur_nom TEXT,
  image_url TEXT,
  stock_kg NUMERIC DEFAULT 0,
  disponible BOOLEAN DEFAULT true,
  badge TEXT,
  note_moyenne NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.produits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.produits FOR SELECT USING (true);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  prenom TEXT,
  nom TEXT,
  telephone TEXT,
  quartier TEXT,
  adresse TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Commandes table
CREATE TABLE public.commandes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  statut TEXT DEFAULT 'recue' CHECK (statut IN ('recue', 'preparation', 'livraison', 'livree', 'annulee')),
  adresse_livraison JSONB,
  creneau_livraison TEXT,
  date_livraison DATE,
  montant_total INT,
  frais_livraison INT DEFAULT 1000,
  mode_paiement TEXT,
  livreur_nom TEXT,
  livreur_telephone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.commandes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders" ON public.commandes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.commandes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Lignes de commande
CREATE TABLE public.lignes_commande (
  id SERIAL PRIMARY KEY,
  commande_id UUID REFERENCES public.commandes(id) ON DELETE CASCADE NOT NULL,
  produit_id INT REFERENCES public.produits(id) NOT NULL,
  quantite NUMERIC NOT NULL,
  prix_unitaire INT NOT NULL,
  sous_total INT NOT NULL
);

ALTER TABLE public.lignes_commande ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own order lines" ON public.lignes_commande FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.commandes WHERE commandes.id = lignes_commande.commande_id AND commandes.user_id = auth.uid())
);
CREATE POLICY "Users can create order lines" ON public.lignes_commande FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.commandes WHERE commandes.id = lignes_commande.commande_id AND commandes.user_id = auth.uid())
);

-- Avis table
CREATE TABLE public.avis (
  id SERIAL PRIMARY KEY,
  produit_id INT REFERENCES public.produits(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  note INT NOT NULL CHECK (note >= 1 AND note <= 5),
  commentaire TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.avis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are viewable by everyone" ON public.avis FOR SELECT USING (true);
CREATE POLICY "Users can create their own reviews" ON public.avis FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Abonnements table
CREATE TABLE public.abonnements (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  formule TEXT NOT NULL,
  jour_livraison TEXT,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.abonnements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own subscriptions" ON public.abonnements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create subscriptions" ON public.abonnements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscriptions" ON public.abonnements FOR UPDATE USING (auth.uid() = user_id);

-- Enable realtime for commandes
ALTER PUBLICATION supabase_realtime ADD TABLE public.commandes;
