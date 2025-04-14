
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, Lock, Settings as SettingsIcon, Link as LinkIcon, 
  CreditCard, HelpCircle, LogOut, Camera, Check, Loader2
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
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEmailConnect = (provider: 'gmail' | 'outlook') => {
    connectEmail(provider);
  };

  const handleEmailDisconnect = async (provider: 'gmail' | 'outlook') => {
    const result = await disconnectEmail(provider);
    if (result) {
      toast.success(`Compte ${provider === 'gmail' ? 'Gmail' : 'Outlook'} déconnecté`);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setIsLoading(true);
      
      // Simulating an API call
      setTimeout(() => {
        // In a real app, you would call an API to update profile here
        toast.success('Profil mis à jour avec succès');
        setIsLoading(false);
        setIsEditing(false);
      }, 1000);
    } else {
      // Enter edit mode and populate form with current values
      if (profile) {
        setFormData({
          fullName: profile.full_name,
          phoneNumber: profile.phone_number || '',
        });
      }
      setIsEditing(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would upload the file to your storage
      // For this example, we'll just show a success message
      toast.success('Photo de profil mise à jour');
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <User className="mr-2" /> Profil personnel
            </h2>
            <Button
              onClick={handleEditToggle}
              variant={isEditing ? "default" : "outline"}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isEditing ? (
                <Check className="mr-2 h-4 w-4" />
              ) : null}
              {isEditing ? "Enregistrer" : "Modifier"}
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative" onClick={isEditing ? handleAvatarClick : undefined}>
                <Avatar className={`h-16 w-16 ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}>
                  <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                  {isEditing && (
                    <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                      <Camera className="h-3 w-3 text-white" />
                    </div>
                  )}
                </Avatar>
                {isEditing && (
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                )}
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="fullName">Nom complet</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-medium">{profile.full_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {profile.phone_number && (
                      <p className="text-sm text-gray-500">{profile.phone_number}</p>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Type de compte</Label>
              <p className="text-sm font-medium">
                {profile.plan === 'pro' ? 'Pro' : 'Gratuit'}
              </p>
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
