
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
  const [error, setError] = useState<string | null>(null);

  // Charger les comptes connectés au montage
  useEffect(() => {
    loadConnectedAccounts();
  }, []);

  // Vérifier les paramètres d'URL pour les succès ou erreurs de connexion
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailConnected = urlParams.get('email_connected');
    const provider = urlParams.get('provider');
    const emailError = urlParams.get('email_error');
    const errorCode = urlParams.get('code');
    
    // Gérer les cas de succès
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
    
    // Gérer les cas d'erreur
    if (emailError) {
      let errorMessage = "Une erreur s'est produite lors de la connexion du compte email.";
      
      switch (emailError) {
        case 'missing_params':
          errorMessage = "Paramètres manquants dans la requête d'authentification.";
          break;
        case 'invalid_state':
          errorMessage = "État de la requête invalide.";
          break;
        case 'missing_credentials':
          errorMessage = "Identifiants OAuth non configurés. Veuillez contacter l'administrateur.";
          break;
        case 'token_exchange_failed':
          errorMessage = `Échec de l'échange du code d'autorisation contre un token${errorCode ? ` (${errorCode})` : ''}.`;
          break;
        case 'token_storage_failed':
          errorMessage = "Impossible de stocker les tokens d'accès.";
          break;
        case 'table_not_exists':
          errorMessage = "Table de tokens non configurée. Veuillez contacter l'administrateur.";
          break;
        case 'processing_error':
          errorMessage = "Erreur lors du traitement de l'authentification.";
          break;
      }
      
      toast({
        title: "Échec de connexion",
        description: errorMessage,
        variant: "destructive",
        duration: 7000,
      });
      
      // Nettoyer l'URL après affichage du toast
      navigate('/dashboard', { replace: true });
      
      setError(errorMessage);
    }
  }, [navigate, toast]);

  // Fonction pour charger les comptes email connectés
  const loadConnectedAccounts = async () => {
    setIsLoading(true);
    setError(null);
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
        setError(`Erreur lors de la récupération des comptes email: ${error.message}`);
      } else {
        if (data?.error) {
          console.error('Erreur retournée par la fonction get-email-tokens:', data.error);
          setConnectedAccounts([]);
          setError(data.error);
        } else {
          const tokens = data?.tokens || [];
          const accounts: EmailAccount[] = tokens.map((token: any) => ({
            provider: token.provider as 'gmail' | 'outlook',
            email: token.email,
            connected: true
          }));
          
          setConnectedAccounts(accounts);
        }
      }
    } catch (error: any) {
      console.error('Exception lors de la vérification des comptes email:', error);
      setConnectedAccounts([]);
      setError(`Exception: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour connecter un compte email
  const connectEmail = async (provider: 'gmail' | 'outlook') => {
    setError(null);
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
      
      // Afficher un toast de chargement
      toast({
        title: "Connexion en cours",
        description: `Redirection vers la page d'authentification ${provider === 'gmail' ? 'Google' : 'Microsoft'}...`,
        duration: 3000,
      });
      
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
        setError(error.message);
        return;
      }
      
      // Vérifier si l'API a retourné une erreur
      if (data.error) {
        console.error('Erreur retournée par la fonction connect-email:', data.error);
        toast({
          title: "Échec de la connexion",
          description: data.error,
          variant: "destructive",
        });
        setError(data.error);
        return;
      }
      
      // Vérifier les variables d'environnement (si présentes dans la réponse)
      if (data.env_check) {
        const { gmail_client_id_defined, outlook_client_id_defined, redirect_uri_defined } = data.env_check;
        const missingVars = [];
        
        if (provider === 'gmail' && !gmail_client_id_defined) missingVars.push('GMAIL_CLIENT_ID');
        if (provider === 'outlook' && !outlook_client_id_defined) missingVars.push('OUTLOOK_CLIENT_ID');
        if (!redirect_uri_defined) missingVars.push('EMAIL_OAUTH_REDIRECT_URI');
        
        if (missingVars.length > 0) {
          const errorMsg = `Variables d'environnement manquantes: ${missingVars.join(', ')}`;
          console.error(errorMsg);
          toast({
            title: "Erreur de configuration",
            description: errorMsg,
            variant: "destructive",
          });
          setError(errorMsg);
          return;
        }
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
        setError("URL d'authentification manquante");
      }
    } catch (error: any) {
      console.error('Exception lors de la connexion du compte email:', error);
      toast({
        title: "Échec de la connexion",
        description: "Impossible de connecter votre compte email: " + error.message,
        variant: "destructive",
      });
      setError(error.message);
    }
  };

  // Fonction pour déconnecter un compte email
  const disconnectEmail = async (provider: 'gmail' | 'outlook') => {
    setError(null);
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        return false;
      }
      
      // Appel à l'edge function pour supprimer le token
      const { error, data } = await supabase.functions.invoke('delete-email-token', {
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
        setError(error.message);
        return false;
      }
      
      // Vérifier si l'API a retourné une erreur
      if (data?.error) {
        console.error('Erreur retournée par delete-email-token:', data.error);
        toast({
          title: "Échec de la déconnexion",
          description: data.error,
          variant: "destructive",
        });
        setError(data.error);
        return false;
      }
      
      // Recharger les comptes connectés
      await loadConnectedAccounts();
      
      toast({
        title: "Compte déconnecté",
        description: `Votre compte ${provider === 'gmail' ? 'Gmail' : 'Outlook'} a été déconnecté avec succès.`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Exception lors de la déconnexion du compte email:', error);
      setError(error.message);
      return false;
    }
  };

  return { 
    connectEmail, 
    disconnectEmail, 
    connectedAccounts, 
    isLoading,
    error,
    refreshAccounts: loadConnectedAccounts
  };
};
