
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmailAccount {
  provider: 'gmail' | 'outlook';
  email?: string;
  connected: boolean;
}

export const useEmailConnection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [connectedAccounts, setConnectedAccounts] = useState<EmailAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les comptes connectés au montage
  useEffect(() => {
    loadConnectedAccounts();
  }, []);

  // Vérifier si le paramètre email_connected est présent dans l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailConnected = urlParams.get('email_connected');
    const provider = urlParams.get('provider');
    
    if (emailConnected === 'true' && provider) {
      toast({
        title: "Compte email connecté !",
        description: `Votre compte ${provider === 'gmail' ? 'Gmail' : 'Outlook'} a été connecté avec succès.`,
        duration: 5000,
      });
      
      // Nettoyer l'URL après affichage du toast
      navigate('/dashboard', { replace: true });
      
      // Recharger les comptes connectés
      loadConnectedAccounts();
    }
  }, [navigate, toast]);

  // Fonction pour charger les comptes email connectés
  const loadConnectedAccounts = async () => {
    setIsLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        setConnectedAccounts([]);
        setIsLoading(false);
        return;
      }
      
      // Appel à l'edge function pour récupérer les tokens
      const { data, error } = await supabase.functions.invoke('get-email-tokens', {
        body: { user_id: session.session.user.id }
      });
      
      if (error) {
        console.error('Erreur lors de la récupération des comptes email:', error);
        setConnectedAccounts([]);
      } else {
        const tokens = data?.tokens || [];
        const accounts: EmailAccount[] = tokens.map((token: any) => ({
          provider: token.provider as 'gmail' | 'outlook',
          email: token.email,
          connected: true
        }));
        
        setConnectedAccounts(accounts);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des comptes email:', error);
      setConnectedAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour connecter un compte email
  const connectEmail = async (provider: 'gmail' | 'outlook') => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session.session?.user.id;
      
      if (!userId) {
        toast({
          title: "Non connecté",
          description: "Vous devez être connecté pour utiliser cette fonctionnalité.",
          variant: "destructive",
        });
        return;
      }
      
      // Appel à l'edge function pour obtenir l'URL d'authentification
      const { data, error } = await supabase.functions.invoke('connect-email', {
        body: {
          provider,
          user_id: userId
        }
      });
      
      if (error) {
        console.error('Erreur lors de la connexion du compte email:', error);
        toast({
          title: "Échec de la connexion",
          description: "Impossible de connecter votre compte email. " + error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Rediriger vers l'URL d'authentification
      if (data.auth_url) {
        console.log("Redirection vers:", data.auth_url);
        window.location.href = data.auth_url;
      } else {
        toast({
          title: "Erreur de configuration",
          description: "URL d'authentification manquante. Veuillez contacter le support.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Erreur lors de la connexion du compte email:', error);
      toast({
        title: "Échec de la connexion",
        description: "Impossible de connecter votre compte email: " + error.message,
        variant: "destructive",
      });
    }
  };

  // Fonction pour déconnecter un compte email
  const disconnectEmail = async (provider: 'gmail' | 'outlook') => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        return false;
      }
      
      // Appel à l'edge function pour supprimer le token
      const { error } = await supabase.functions.invoke('delete-email-token', {
        body: { 
          user_id: session.session.user.id,
          provider
        }
      });
      
      if (error) {
        console.error('Erreur lors de la déconnexion du compte email:', error);
        toast({
          title: "Échec de la déconnexion",
          description: "Impossible de déconnecter votre compte email. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
        return false;
      }
      
      // Recharger les comptes connectés
      await loadConnectedAccounts();
      
      toast({
        title: "Compte déconnecté",
        description: `Votre compte ${provider === 'gmail' ? 'Gmail' : 'Outlook'} a été déconnecté avec succès.`,
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la déconnexion du compte email:', error);
      return false;
    }
  };

  return { 
    connectEmail, 
    disconnectEmail, 
    connectedAccounts, 
    isLoading,
    refreshAccounts: loadConnectedAccounts
  };
};
