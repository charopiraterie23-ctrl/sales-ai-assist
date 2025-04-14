
export interface EmailAccount {
  provider: 'gmail' | 'outlook';
  email?: string;
  connected: boolean;
}

export interface EmailConnectionState {
  connectedAccounts: EmailAccount[];
  isLoading: boolean;
  error: string | null;
}
