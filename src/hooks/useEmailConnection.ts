
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
      
      // Récupérer les tokens email de l'utilisateur
      const { data: tokens, error } = await supabase
        .from('email_tokens')
        .select('provider, email')
        .eq('user_id', session.session.user.id);
      
      if (error) {
        console.error('Erreur lors de la récupération des comptes email:', error);
        setConnectedAccounts([]);
      } else {
        const accounts: EmailAccount[] = tokens?.map(token => ({
          provider: token.provider as 'gmail' | 'outlook',
          email: token.email,
          connected: true
        })) || [];
        
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
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) return;
    
    try {
      const response = await fetch(`https://xqetqqjcmjdcnnswtgho.supabase.co/functions/v1/connect-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session?.access_token}`
        },
        body: JSON.stringify({
          provider,
          user_id: userId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Rediriger vers l'URL d'authentification
      if (data.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (error) {
      console.error('Erreur lors de la connexion du compte email:', error);
      toast({
        title: "Échec de la connexion",
        description: "Impossible de connecter votre compte email. Veuillez réessayer plus tard.",
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
      
      // Supprimer le token de la base de données
      const { error } = await supabase
        .from('email_tokens')
        .delete()
        .eq('user_id', session.session.user.id)
        .eq('provider', provider);
      
      if (error) {
        console.error('Erreur lors de la déconnexion du compte email:', error);
        toast({
          title: "Échec de la déconnexion",
          description: "Impossible de déconnecter votre compte email. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
        return false;
      }
      
      // Vérifier s'il reste des comptes connectés
      const { data: remainingTokens } = await supabase
        .from('email_tokens')
        .select('id')
        .eq('user_id', session.session.user.id);
      
      // Si aucun compte n'est connecté, mettre à jour email_synced à false
      if (!remainingTokens || remainingTokens.length === 0) {
        await supabase
          .from('profiles')
          .update({ email_synced: false })
          .eq('id', session.session.user.id);
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
