/**
 * Images de secours par slug lorsque `image_url` est vide en base.
 * Photos Unsplash (https://unsplash.com/license) — libres d’usage pour ce type d’app.
 * Priorité : `image_url` en Supabase ; sinon ce mapping ; sinon placeholder.
 */
const u = (path: string) =>
  `https://images.unsplash.com/${path}?auto=format&fit=crop&w=900&q=80`;

const productImages: Record<string, string> = {
  thiof: u('photo-1512058564366-18510be2db19'),
  yaboye: u('photo-1467003909585-2f8a72700288'),
  sardinelle: u('photo-1544943910-4c1dc4aabde7'),
  'dorade-royale': u('photo-1544551763-46a013bb70d5'),
  'crevettes-casamance': u('photo-1565680018434-b513d5e5fd47'),
  'madd-casamance': u('photo-1605027990121-8728f8d5b7d6'),
  ditakh: u('photo-1610832958506-aa5636817c94'),
  bouye: u('photo-1599599826927-2e23494d8f85'),
  'jus-de-madd': u('photo-1622597463919-936315e6f0f0'),
  'confits-ditakh': u('photo-1558642452-9d2a7bf7f3ad'),
  'poudre-de-bouye': u('photo-1565557623262-b51c2513a641'),
  'panier-famille': u('photo-1542838132-92c53300491e'),
};

export function getProductImage(slug: string, imageUrl: string | null): string {
  return imageUrl || productImages[slug] || '/placeholder.svg';
}
