
import ReadyEmailsAlert from './alerts/ReadyEmailsAlert';
import NoFollowupCallsAlert from './alerts/NoFollowupCallsAlert';
import EmailConnectionAlert from './alerts/EmailConnectionAlert';
import { DashboardData } from '@/hooks/useDashboardData';

interface DashboardAlertsProps {
  dashboardData: DashboardData;
  userPlan: string;
  connectEmail: (provider: 'gmail' | 'outlook') => Promise<void>;
  emailSynced: boolean | undefined;
  userEmail?: string;
}

const DashboardAlerts = ({ 
  dashboardData, 
  userPlan, 
  connectEmail, 
  emailSynced,
  userEmail
}: DashboardAlertsProps) => {
  // Count emails ready to send
  const emailCount = dashboardData.emailsToSend?.emails?.length || 0;
  
  // Count calls without followup
  const callCount = dashboardData.callsToFollow?.calls?.length || 0;
  
  return (
    <div className="space-y-4">
      {/* Ready to send emails alert */}
      <ReadyEmailsAlert emailCount={emailCount} />
      
      {/* Calls without followup alert */}
      <NoFollowupCallsAlert callCount={callCount} />
      
      {/* Email connection alert */}
      <EmailConnectionAlert 
        isEmailConnected={!!emailSynced} 
        connectedEmail={userEmail}
        connectEmail={connectEmail} 
      />
    </div>
  );
};

export default DashboardAlerts;
