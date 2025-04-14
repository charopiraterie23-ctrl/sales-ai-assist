
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PlanUsage from '@/components/dashboard/PlanUsage';

interface StatisticsCardProps {
  callsUsed: number;
  callsTotal: number;
  usagePercentage: number;
}

const StatisticsCard = ({ callsUsed, callsTotal, usagePercentage }: StatisticsCardProps) => {
  return (
    <Card className="animate-slide-up">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Vos statistiques</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <PlanUsage 
          callsUsed={callsUsed} 
          callsTotal={callsTotal} 
          usagePercentage={usagePercentage}
          userPlan="pro"
        />
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-xl font-bold text-nexentry-blue">76%</div>
            <div className="text-xs text-gray-600">Taux de relance</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-xl font-bold text-nexentry-blue">12</div>
            <div className="text-xs text-gray-600">Clients actifs</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
