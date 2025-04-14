
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, Lock, Settings as SettingsIcon, Link as LinkIcon, 
  CreditCard, HelpCircle, LogOut 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEmailConnection } from '@/hooks/useEmailConnection';
import { toast } from '@/components/ui/sonner';

const SettingsPage = () => {
  const { user, profile, signOut } = useAuth();
  const { connectEmail, disconnectEmail, connectedAccounts } = useEmailConnection();
  const [aiTone, setAITone] = useState('professional');
  const [emailLanguage, setEmailLanguage] = useState('french');
  const [summaryStructure, setSummaryStructure] = useState('points');

  const handleEmailConnect = (provider: 'gmail' | 'outlook') => {
    connectEmail(provider);
  };

  const handleEmailDisconnect = async (provider: 'gmail' | 'outlook') => {
    const result = await disconnectEmail(provider);
    if (result) {
      toast.success(`Compte ${provider === 'gmail' ? 'Gmail' : 'Outlook'} déconnecté`);
    }
  };

  if (!user || !profile) return null;

  const initials = profile.full_name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Layout title="Paramètres">
      <div className="space-y-8 max-w-2xl mx-auto">
        {/* 1. Bloc : Profil personnel */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <User className="mr-2" /> Profil personnel
          </h2>
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{profile.full_name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* 2. Bloc : Sécurité */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Lock className="mr-2" /> Sécurité
          </h2>
          <Button variant="outline" className="w-full mb-4">
            Réinitialiser mot de passe
          </Button>
        </div>

        {/* 3. Bloc : Préférences IA */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <SettingsIcon className="mr-2" /> Préférences IA
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Ton des emails</label>
              <Select value={aiTone} onValueChange={setAITone}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un ton" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professionnel</SelectItem>
                  <SelectItem value="friendly">Détendu / Amical</SelectItem>
                  <SelectItem value="neutral">Neutre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2">Langue des emails</label>
              <Select value={emailLanguage} onValueChange={setEmailLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="french">Français</SelectItem>
                  <SelectItem value="english">Anglais</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2">Structure des résumés</label>
              <Select value={summaryStructure} onValueChange={setSummaryStructure}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une structure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="points">Résumé par points</SelectItem>
                  <SelectItem value="short">Résumé court</SelectItem>
                  <SelectItem value="detailed">Résumé détaillé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 4. Bloc : Intégrations */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <LinkIcon className="mr-2" /> Intégrations
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Gmail</span>
              {connectedAccounts.some(a => a.provider === 'gmail') ? (
                <Button variant="destructive" size="sm" onClick={() => handleEmailDisconnect('gmail')}>
                  Déconnecter
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => handleEmailConnect('gmail')}>
                  Connecter
                </Button>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span>Outlook</span>
              {connectedAccounts.some(a => a.provider === 'outlook') ? (
                <Button variant="destructive" size="sm" onClick={() => handleEmailDisconnect('outlook')}>
                  Déconnecter
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => handleEmailConnect('outlook')}>
                  Connecter
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 5. Bloc : Plan et facturation */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CreditCard className="mr-2" /> Plan et facturation
          </h2>
          <div className="space-y-4">
            <p>Plan actuel : Gratuit</p>
            <p>Appels traités ce mois : 7/15</p>
            <p>Prochaine facturation : 13 mai 2025</p>
            <Button variant="outline" className="w-full">
              Gérer mon abonnement
            </Button>
          </div>
        </div>

        {/* 6. Bloc : Support / Legal */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <HelpCircle className="mr-2" /> Support / Legal
          </h2>
          <div className="space-y-4">
            <a href="#" className="block hover:underline">FAQ</a>
            <a href="#" className="block hover:underline">Politique de confidentialité</a>
            <a href="#" className="block hover:underline">Conditions d'utilisation</a>
            <a href="mailto:contact@nexentry.io" className="block hover:underline">
              Contact support
            </a>
          </div>
        </div>

        {/* 7. Bloc final : Déconnexion */}
        <div className="bg-white shadow rounded-lg p-6">
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={() => {
              signOut();
              toast.success('Vous êtes maintenant déconnecté');
            }}
          >
            <LogOut className="mr-2" /> Se déconnecter
          </Button>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Vous pouvez vous reconnecter à tout moment.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
