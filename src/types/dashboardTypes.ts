
export interface CallsThisMonth {
  total_calls: number;
}

export interface Email {
  id: string;
  to: string;
  subject: string;
  body: string;
  summary_id: string;
}

export interface EmailsToSend {
  emails: Email[];
}

export interface Call {
  id: string;
  client_id: string;
  created_at: string;
}

export interface CallsToFollow {
  calls: Call[];
}

export interface UsageData {
  minutesUsed: number;
  totalMinutes: number;
}

export interface DashboardData {
  callsThisMonth: CallsThisMonth | null;
  emailsToSend: EmailsToSend | null;
  callsToFollow: CallsToFollow | null;
  usageData: UsageData | null;
  isLoadingData: boolean;
  isLoadingCalls: boolean;
  isLoadingEmails: boolean;
  isLoadingFollowup: boolean;
  refetch: () => Promise<void>;
}

