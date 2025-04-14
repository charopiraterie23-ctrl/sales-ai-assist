
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useConnectEmail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

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

  return { connectEmail, error };
};
