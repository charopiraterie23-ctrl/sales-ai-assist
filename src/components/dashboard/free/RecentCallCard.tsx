
import CallSummaryCard from '../CallSummaryCard';

interface RecentCallCardProps {
  hasRecentCall: boolean;
}

const RecentCallCard = ({ hasRecentCall }: RecentCallCardProps) => {
  if (!hasRecentCall) return null;
  
  return (
    <CallSummaryCard
      title="Votre dernier résumé"
      clientName="Appel avec Pierre Durand"
      date="Hier"
      duration="18 min"
      summary="Discussion sur le nouveau contrat SaaS. Le client souhaite ajouter 5 licences supplémentaires et organiser une démo pour l'équipe marketing."
      summaryId="123"
    />
  );
};

export default RecentCallCard;
