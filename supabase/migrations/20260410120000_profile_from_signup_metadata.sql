-- Remplit le profil depuis les métadonnées passées à auth.signUp (options.data)
-- Nécessaire lorsque la confirmation e-mail est activée : pas de session => l'UPDATE client échouait (RLS).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, prenom, nom, telephone, quartier)
  VALUES (
    NEW.id,
    NULLIF(TRIM(NEW.raw_user_meta_data->>'prenom'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'nom'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'telephone'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'quartier'), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
