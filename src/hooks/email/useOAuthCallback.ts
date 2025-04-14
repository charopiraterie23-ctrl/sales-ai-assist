
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useOAuthCallback = (refreshAccounts: () => Promise<void>) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleOAuthCallback = async () => {
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
        await refreshAccounts();
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
      }
    };
    
    handleOAuthCallback();
  }, [navigate, toast, refreshAccounts]);
};
