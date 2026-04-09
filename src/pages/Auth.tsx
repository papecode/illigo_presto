import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const quartiers = ['Parcelles Assainies', 'Guédiawaye', 'Pikine', 'Keur Massar', 'Médina', 'Plateau', 'Almadies', 'Ouakam', 'Yoff', 'Grand Dakar', 'Rufisque'];

export default function Auth() {
  const nav = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const [loading, setLoading] = useState(false);
  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  // Register
  const [regPrenom, setRegPrenom] = useState('');
  const [regNom, setRegNom] = useState('');
  const [regTelephone, setRegTelephone] = useState('');
  const [regQuartier, setRegQuartier] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) toast.error(error.message);
    else { toast.success('Connecté !'); nav(from, { replace: true }); }
    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          prenom: regPrenom,
          nom: regNom,
          telephone: regTelephone,
          quartier: regQuartier,
        },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.user) {
      toast.error('Inscription impossible. Réessayez ou utilisez un autre email.');
      return;
    }
    if (data.session) {
      toast.success('Compte créé. Vous êtes connecté !');
      nav(from, { replace: true });
      return;
    }
    toast.success(
      'Compte créé. Ouvrez le lien de confirmation envoyé par email pour activer le compte, puis connectez-vous.',
      { duration: 9000 },
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Left illustration - desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="text-primary-foreground max-w-md">
          <h2 className="font-display text-3xl font-bold">Illigo Presto</h2>
          <p className="mt-4 opacity-80 text-lg">Du pêcheur à votre table. Rejoignez des milliers de ménages dakarois qui font confiance à nos produits frais.</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-bold text-center mb-6">Bienvenue</h1>
          
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-3">
              <Input type="email" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
              <Input type="password" placeholder="Mot de passe" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
              <Button onClick={handleLogin} disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Prénom" value={regPrenom} onChange={e => setRegPrenom(e.target.value)} />
                <Input placeholder="Nom" value={regNom} onChange={e => setRegNom(e.target.value)} />
              </div>
              <Input placeholder="Téléphone" value={regTelephone} onChange={e => setRegTelephone(e.target.value)} />
              <Select value={regQuartier} onValueChange={setRegQuartier}>
                <SelectTrigger><SelectValue placeholder="Quartier" /></SelectTrigger>
                <SelectContent>{quartiers.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
              </Select>
              <Input type="email" placeholder="Email" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
              <Input type="password" placeholder="Mot de passe" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
              <Button onClick={handleRegister} disabled={loading} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                {loading ? 'Inscription...' : "S'inscrire"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
