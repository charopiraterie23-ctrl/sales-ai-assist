
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface TodayOverviewCardProps {
  pendingCallsToday: number;
  readyEmails: number;
  clientsToFollowUp: number;
}

const TodayOverviewCard = ({ pendingCallsToday, readyEmails, clientsToFollowUp }: TodayOverviewCardProps) => {
  return (
    <Card className="border-nexentry-blue border-l-4 animate-slide-up">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-3">Aujourd'hui</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-nexentry-blue mb-1">{pendingCallsToday}</div>
            <div className="text-xs text-gray-600">Appels à traiter</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-nexentry-blue mb-1">{readyEmails}</div>
            <div className="text-xs text-gray-600">Emails prêts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-nexentry-blue mb-1">{clientsToFollowUp}</div>
            <div className="text-xs text-gray-600">Clients à relancer</div>
          </div>
        </div>
        <Button className="w-full bg-nexentry-blue hover:bg-nexentry-blue-dark">
          <Calendar className="h-4 w-4 mr-2" /> Voir mes actions du jour
        </Button>
      </CardContent>
    </Card>
  );
};

export default TodayOverviewCard;
