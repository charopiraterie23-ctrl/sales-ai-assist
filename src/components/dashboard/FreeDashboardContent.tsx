
import { useNavigate } from 'react-router-dom';
import FirstLoginCard from './free/FirstLoginCard';
import NewCallCard from './free/NewCallCard';
import RecentCallCard from './free/RecentCallCard';
import RecentClientsCard from './free/RecentClientsCard';
import UsageCard from './free/UsageCard';
import TipCard from './TipCard';
import QuickLinksGrid from './free/QuickLinksGrid';

interface FreeDashboardContentProps {
  isFirstLogin: boolean;
  hasRecentCall: boolean;
  navigate: ReturnType<typeof useNavigate>;
  tipIndex: number;
  callsUsed: number;
  callsTotal: number;
  usagePercentage: number;
}

const tips = [
  "Saviez-vous que vos relances peuvent être envoyées directement depuis Gmail ?",
  "Ajoutez des tags à vos résumés pour les retrouver plus vite",
  "Partagez vos résumés avec vos collègues en un clic",
  "Utilisez la recherche pour retrouver rapidement vos anciens appels"
];

const FreeDashboardContent = ({ 
  isFirstLogin, 
  hasRecentCall, 
  navigate, 
  tipIndex, 
  callsUsed, 
  callsTotal, 
  usagePercentage 
}: FreeDashboardContentProps) => {
  return (
    <>
      {/* First Login Welcome Card */}
      {isFirstLogin && <FirstLoginCard />}

      {/* Primary Action Card */}
      <NewCallCard />

      {/* Last Call Summary (if exists) */}
      <RecentCallCard hasRecentCall={hasRecentCall} />

      {/* Client Snapshot */}
      <RecentClientsCard />

      {/* Plan Usage Block */}
      <UsageCard 
        callsUsed={callsUsed} 
        callsTotal={callsTotal} 
        usagePercentage={usagePercentage} 
      />

      {/* Smart Tip */}
      <TipCard tip={tips[tipIndex]} isPro={false} />

      {/* Quick Links Grid */}
      <QuickLinksGrid />
    </>
  );
};

export default FreeDashboardContent;
