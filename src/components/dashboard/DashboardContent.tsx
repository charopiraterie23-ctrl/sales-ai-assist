
import { NavigateFunction } from 'react-router-dom';
import { DashboardData } from '@/types/dashboardTypes';
import IntegrationsCard from './IntegrationsCard';
import TodaySummaryCard from './TodaySummaryCard';
import ActivityFeed from './ActivityFeed';
import DraftEmailsCard from './DraftEmailsCard';
import InsightsCard from './InsightsCard';
import ActiveClientsCard from './ActiveClientsCard';
import FreeDashboardContent from './FreeDashboardContent';
import ProDashboardContent from './ProDashboardContent';
import { mockActivities } from './mockData';

interface DashboardContentProps {
  userPlan: string;
  isEmailConnected: boolean;
  isSMSConnected: boolean;
  pendingCallsToday: number;
  readyEmails: number;
  clientsToFollowUp: number;
  callsUsed: number;
  callsTotal: number;
  usagePercentage: number;
  dashboardData: DashboardData;
  isActivityLoading: boolean;
  hasRecentCall: boolean;
  navigate: NavigateFunction;
  tipIndex: number;
  onConnectEmail: () => void;
}

const DashboardContent = ({
  userPlan,
  isEmailConnected,
  isSMSConnected,
  pendingCallsToday,
  readyEmails,
  clientsToFollowUp,
  callsUsed,
  callsTotal,
  usagePercentage,
  dashboardData,
  isActivityLoading,
  hasRecentCall,
  navigate,
  tipIndex,
  onConnectEmail
}: DashboardContentProps) => {
  const isPro = userPlan === 'pro';
  const isFirstLogin = false; // This would be determined by user data

  if (isPro) {
    return (
      <>
        {/* Carte intégrations - affichée seulement si email ou SMS non connectés */}
        <IntegrationsCard 
          isEmailConnected={isEmailConnected} 
          isSMSConnected={isSMSConnected} 
          onConnectEmail={onConnectEmail}
          onConnectSMS={() => console.log('SMS connect functionality to be implemented')} 
        />

        {/* Pro Dashboard Content */}
        <ProDashboardContent 
          navigate={navigate} 
          tipIndex={tipIndex} 
          callsUsed={callsUsed} 
          callsTotal={callsTotal} 
          usagePercentage={usagePercentage}
          dashboardData={dashboardData}
          isEmailConnected={isEmailConnected}
          onConnectEmail={onConnectEmail}
        />
      </>
    );
  }

  return (
    <>
      {/* Carte intégrations - affichée seulement si email ou SMS non connectés */}
      <IntegrationsCard 
        isEmailConnected={isEmailConnected} 
        isSMSConnected={isSMSConnected} 
        onConnectEmail={onConnectEmail}
        onConnectSMS={() => console.log('SMS connect functionality to be implemented')} 
      />

      {/* Carte Ma Journée */}
      <TodaySummaryCard 
        pendingCallsToday={pendingCallsToday}
        readyEmails={readyEmails}
        clientsToFollowUp={clientsToFollowUp}
        navigateToActions={() => navigate('/daily-actions')}
        isClickToCallEnabled={false}
      />

      {/* Section Fil d'activité */}
      <div className="pt-2">
        <h2 className="text-base font-semibold mb-2">Fil d'activité</h2>
        <ActivityFeed 
          isLoading={isActivityLoading}
          activities={mockActivities} 
        />
      </div>

      {/* Carte Brouillons à envoyer */}
      <DraftEmailsCard 
        isEmailConnected={isEmailConnected}
        isLoading={dashboardData.isLoadingEmails}
        emails={dashboardData.emailsToSend?.emails}
        onConnectEmail={onConnectEmail}
        onSendAll={() => console.log('Sending all emails:', dashboardData.emailsToSend?.emails)}
      />

      {/* Carte Insights */}
      <InsightsCard />

      {/* Carte Clients actifs */}
      <ActiveClientsCard />
      
      {/* Free dashboard content */}
      <FreeDashboardContent 
        isFirstLogin={isFirstLogin}
        hasRecentCall={hasRecentCall}
        navigate={navigate}
        tipIndex={tipIndex}
        callsUsed={callsUsed}
        callsTotal={callsTotal}
        usagePercentage={usagePercentage}
      />
    </>
  );
};

export default DashboardContent;
