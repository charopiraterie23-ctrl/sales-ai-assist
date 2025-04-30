
import { Badge } from '@/components/ui/badge';

interface DashboardWelcomeHeaderProps {
  fullName: string;
  userPlan: string;
  trialMinutesRemaining?: number;
  showTrialBanner?: boolean;
}

const DashboardWelcomeHeader = ({ 
  fullName, 
  userPlan, 
  trialMinutesRemaining, 
  showTrialBanner 
}: DashboardWelcomeHeaderProps) => {
  // Normaliser à nouveau userPlan pour éviter des problèmes de casse
  const isPro = userPlan?.toLowerCase() === 'pro';
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold mb-1">
          Bonjour {fullName || 'utilisateur'} 👋
        </h1>
        {isPro && (
          <Badge variant="outline" className="h-6 w-6 p-0 flex items-center justify-center rounded-full bg-green-500 text-white">
            Pro
          </Badge>
        )}
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Prêt·e pour une journée productive ?
        </p>
        {showTrialBanner && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {trialMinutesRemaining} min audio restantes
          </span>
        )}
      </div>
    </div>
  );
};

export default DashboardWelcomeHeader;
