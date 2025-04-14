
import { useState } from 'react';
import { EmailAccount } from './types';
import { supabase } from '@/integrations/supabase/client';

export const useLoadEmailAccounts = () => {
  const [connectedAccounts, setConnectedAccounts] = useState<EmailAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return { 
    connectedAccounts, 
    isLoading, 
    error, 
    loadConnectedAccounts 
  };
};
