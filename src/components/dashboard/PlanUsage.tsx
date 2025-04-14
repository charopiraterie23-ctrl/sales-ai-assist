
import { Progress } from '@/components/ui/progress';

interface PlanUsageProps {
  callsUsed: number;
  callsTotal: number;
  usagePercentage: number;
  userPlan: string;
}

const PlanUsage = ({ callsUsed, callsTotal, usagePercentage, userPlan }: PlanUsageProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span>Appels traités ce mois-ci</span>
        <span className="font-medium">{callsUsed} / {callsTotal}</span>
      </div>
      <Progress value={usagePercentage} className="h-2" />
    </div>
  );
};

export default PlanUsage;
