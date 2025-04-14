
import { useNavigate } from 'react-router-dom';
import TodayOverviewCard from './pro/TodayOverviewCard';
import NewCallCard from './free/NewCallCard';
import RecentAISummariesCard from './pro/RecentAISummariesCard';
import ReadyEmailsCard from './pro/ReadyEmailsCard';
import StatisticsCard from './pro/StatisticsCard';
import ActiveClientsCard from './pro/ActiveClientsCard';
import TipCard from './TipCard';
import ProShortcutGrid from './pro/ProShortcutGrid';
import { EmailsToSend, DashboardData } from '@/types/dashboardTypes';

interface ProDashboardContentProps {
  navigate: ReturnType<typeof useNavigate>;
  tipIndex: number;
  callsUsed: number;
  callsTotal: number;
  usagePercentage: number;
  dashboardData: DashboardData;
  isEmailConnected: boolean;
  onConnectEmail: () => void;
}

const tips = [
  "Gagnez du temps en taguant vos résumés. Essayez : #priorité #besoin",
  "Utilisez des raccourcis clavier: Alt+N pour un nouvel appel",
  "Personnalisez vos modèles d'emails pour augmenter vos taux de réponse",
  "Exportez vos données clients au format CSV pour vos analyses"
];

const ProDashboardContent = ({ 
  navigate, 
  tipIndex, 
  callsUsed, 
  callsTotal, 
  usagePercentage,
  dashboardData,
  isEmailConnected,
  onConnectEmail
}: ProDashboardContentProps) => {
  // Sample data for Pro dashboard
  const pendingCallsToday = dashboardData.callsToFollow?.calls.length || 0;
  const readyEmails = dashboardData.emailsToSend?.emails.length || 0;
  const clientsToFollowUp = 0; // À compléter plus tard

  return (
    <>
      {/* Today's Overview (Action-focused block) */}
      <TodayOverviewCard 
        pendingCallsToday={pendingCallsToday}
        readyEmails={readyEmails}
        clientsToFollowUp={clientsToFollowUp}
      />
      
      {/* Primary Action Card - remains the same for all plans */}
      <NewCallCard />

      {/* Recent AI Summaries */}
      <RecentAISummariesCard />

      {/* Ready-to-Send Emails */}
      <ReadyEmailsCard 
        isEmailConnected={isEmailConnected}
        isLoading={dashboardData.isLoadingEmails}
        emails={dashboardData.emailsToSend?.emails}
        onConnectEmail={onConnectEmail}
        onRefresh={dashboardData.refetch}
      />

      {/* Personal Statistics */}
      <StatisticsCard 
        callsUsed={callsUsed}
        callsTotal={callsTotal}
        usagePercentage={usagePercentage}
      />

      {/* Active Clients */}
      <ActiveClientsCard />

      {/* Premium Rotating Tip */}
      <TipCard tip={tips[tipIndex]} isPro={true} />

      {/* Shortcut Grid */}
      <ProShortcutGrid />
    </>
  );
};

export default ProDashboardContent;
