
import { Progress } from '@/components/ui/progress';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { InfoIcon } from 'lucide-react';

interface PlanUsageProps {
  callsUsed: number;
  callsTotal: number;
  usagePercentage: number;
  userPlan?: string;
  title?: string;
  showTooltip?: boolean;
}

const PlanUsage = ({ 
  callsUsed, 
  callsTotal, 
  usagePercentage, 
  userPlan = 'free',
  title = 'Appels traités ce mois-ci',
  showTooltip = false
}: PlanUsageProps) => {
  // Détermine la couleur de la barre de progression selon le pourcentage d'utilisation
  const getProgressColor = () => {
    if (usagePercentage >= 90) return 'bg-red-500';
    if (usagePercentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Détermine si l'utilisateur est proche de sa limite
  const isNearLimit = usagePercentage >= 75;

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1 items-center">
        <div className="flex items-center gap-1">
          <span>{title}</span>
          {showTooltip && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent className="text-sm">
                <p>
                  {userPlan === 'pro' 
                    ? 'Votre plan Pro vous permet de traiter jusqu\'à 100 appels par mois.'
                    : 'Votre plan gratuit vous permet de traiter jusqu\'à 3 appels par mois. Passez au plan Pro pour en avoir plus !'}
                </p>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
        <span className={`font-medium ${isNearLimit ? 'text-red-500' : ''}`}>
          {callsUsed} / {callsTotal}
        </span>
      </div>
      <Progress 
        value={usagePercentage} 
        className={`h-2 ${getProgressColor()}`} 
      />
    </div>
  );
};

export default PlanUsage;
