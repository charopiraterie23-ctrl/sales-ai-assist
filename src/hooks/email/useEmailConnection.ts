
import { useConnectEmail } from './useConnectEmail';
import { useDisconnectEmail } from './useDisconnectEmail';
import { useLoadEmailAccounts } from './useLoadEmailAccounts';
import { useOAuthCallback } from './useOAuthCallback';
import { EmailAccount } from './types';

export const useEmailConnection = () => {
  const { 
    connectedAccounts, 
    isLoading, 
    error: loadError, 
    loadConnectedAccounts 
  } = useLoadEmailAccounts();
  
  const { connectEmail, error: connectError } = useConnectEmail();
  
  const { disconnectEmail, error: disconnectError } = 
    useDisconnectEmail(loadConnectedAccounts);
  
  // Initialize OAuth callback handler
  useOAuthCallback(loadConnectedAccounts);
  
  // Combine errors from different operations
  const error = loadError || connectError || disconnectError;
  
  return { 
    connectEmail, 
    disconnectEmail, 
    connectedAccounts, 
    isLoading,
    error,
    refreshAccounts: loadConnectedAccounts
  };
};

// Re-export types for convenience
export type { EmailAccount } from './types';
