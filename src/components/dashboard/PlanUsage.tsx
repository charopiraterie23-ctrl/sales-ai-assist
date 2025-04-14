
import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cva } from 'class-variance-authority';

interface PlanUsageProps {
  callsUsed: number;
  callsTotal: number;
  usagePercentage: number;
  userPlan: string;
  isLoading?: boolean;
}

const progressVariants = cva("h-2 transition-all duration-500", {
  variants: {
    status: {
      normal: "bg-primary",
      warning: "bg-yellow-500",
      critical: "bg-red-500",
    },
  },
  defaultVariants: {
    status: "normal",
  },
});

const PlanUsage = ({ 
  callsUsed, 
  callsTotal, 
  usagePercentage, 
  userPlan,
  isLoading = false
}: PlanUsageProps) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [status, setStatus] = useState<"normal" | "warning" | "critical">("normal");

  // Détermine le statut basé sur le pourcentage
  useEffect(() => {
    if (usagePercentage >= 90) {
      setStatus("critical");
    } else if (usagePercentage >= 75) {
      setStatus("warning");
    } else {
      setStatus("normal");
    }
    
    // Animation de la barre de progression
    const timer = setTimeout(() => {
      setAnimatedPercentage(usagePercentage);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [usagePercentage]);

  if (isLoading) {
    return (
      <div className="mb-4 space-y-2">
        <div className="flex justify-between mb-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-2 w-full" />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm">Appels traités ce mois-ci</span>
        <span className="font-medium text-sm">
          {callsUsed} / {callsTotal}
          {userPlan === 'pro' && callsUsed >= callsTotal ? ' (Illimité)' : ''}
        </span>
      </div>
      <div className="relative">
        <Progress 
          value={animatedPercentage} 
          className="h-2 bg-gray-100 dark:bg-gray-700"
          indicatorClassName={progressVariants({ status })} 
        />
        {usagePercentage >= 90 && userPlan === 'free' && (
          <div className="mt-1 text-xs text-red-500 animate-pulse">
            Vous approchez de votre limite mensuelle
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanUsage;
