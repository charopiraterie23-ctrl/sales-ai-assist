
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface TodaySummaryCardProps {
  pendingCallsToday: number;
  readyEmails: number;
  clientsToFollowUp: number;
  navigateToActions: () => void;
}

const TodaySummaryCard: React.FC<TodaySummaryCardProps> = ({
  pendingCallsToday,
  readyEmails,
  clientsToFollowUp,
  navigateToActions
}) => {
  return (
    <Card className="animate-fade-in border shadow-md">
      <CardContent className="pt-4 pb-3">
        <h3 className="text-lg font-semibold mb-3">Ma journée</h3>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#2166F0] mb-1">{pendingCallsToday}</div>
            <div className="text-xs uppercase text-gray-600 dark:text-gray-400 tracking-wide">Appels</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-[#2166F0] mb-1">{readyEmails}</div>
            <div className="text-xs uppercase text-gray-600 dark:text-gray-400 tracking-wide">E-mails</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-[#2166F0] mb-1">{clientsToFollowUp}</div>
            <div className="text-xs uppercase text-gray-600 dark:text-gray-400 tracking-wide">Clients</div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-[#2166F0] hover:bg-blue-600 text-white" 
          onClick={navigateToActions}
        >
          <Calendar className="h-4 w-4 mr-2" /> Voir mes actions du jour
        </Button>
      </CardContent>
    </Card>
  );
};

export default TodaySummaryCard;
