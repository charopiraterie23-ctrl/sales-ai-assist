
export type ClientStatus = 'lead' | 'intéressé' | 'en attente' | 'conclu' | 'perdu' | 'all';

export interface ClientType {
  clientId: string;
  fullName: string;
  company?: string;
  email?: string;
  phone?: string;
  lastContacted?: Date;
  status: Exclude<ClientStatus, 'all'>;
}
