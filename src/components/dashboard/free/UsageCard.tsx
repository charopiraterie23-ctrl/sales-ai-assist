
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PlanUsage from '@/components/dashboard/PlanUsage';

interface UsageCardProps {
  callsUsed: number;
  callsTotal: number;
  usagePercentage: number;
}

const UsageCard = ({ callsUsed, callsTotal, usagePercentage }: UsageCardProps) => {
  return (
    <Card className="animate-slide-up">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Votre utilisation</h3>
          <span className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Plan Gratuit</span>
        </div>
        <PlanUsage 
          callsUsed={callsUsed} 
          callsTotal={callsTotal} 
          usagePercentage={usagePercentage}
          userPlan="free"
        />
        <Button variant="outline" className="w-full" asChild>
          <Link to="/pricing">Passez au plan Pro pour appels illimités</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default UsageCard;
