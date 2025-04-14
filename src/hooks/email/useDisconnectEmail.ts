
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useDisconnectEmail = (refreshAccounts: () => Promise<void>) => {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

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
      await refreshAccounts();
      
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

  return { disconnectEmail, error };
};
