
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useEmailConnection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
    }
  }, [navigate, toast]);

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

  return { connectEmail };
};
