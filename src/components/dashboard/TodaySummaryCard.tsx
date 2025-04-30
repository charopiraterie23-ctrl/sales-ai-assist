
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TodaySummaryCardProps {
  pendingCallsToday: number;
  readyEmails: number;
  clientsToFollowUp: number;
  navigateToActions: () => void;
  isClickToCallEnabled?: boolean;
}

const TodaySummaryCard: React.FC<TodaySummaryCardProps> = ({
  pendingCallsToday,
  readyEmails,
  clientsToFollowUp,
  navigateToActions,
  isClickToCallEnabled = false
}) => {
  const navigate = useNavigate();
  
  const handleKpiClick = (type: 'calls' | 'emails' | 'clients') => {
    switch(type) {
      case 'calls':
        navigate('/daily-actions?filter=calls');
        break;
      case 'emails':
        navigate('/daily-actions?filter=emails');
        break;
      case 'clients':
        navigate('/daily-actions?filter=clients');
        break;
    }
  };

  return (
    <Card className="animate-fade-in border shadow-md">
      <CardContent className="pt-4 pb-3">
        <h3 className="text-lg font-semibold mb-3">Ma journée</h3>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div 
            className="text-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            onClick={() => handleKpiClick('calls')}
          >
            <div className="text-2xl font-bold text-[#2166F0] mb-1">{pendingCallsToday}</div>
            <div className="text-xs uppercase text-gray-600 dark:text-gray-400 tracking-wide">Appels</div>
            {!isClickToCallEnabled && pendingCallsToday > 0 && (
              <div className="text-[10px] text-gray-500 mt-1 px-1">Activez les appels sortants</div>
            )}
          </div>
          
          <div 
            className="text-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            onClick={() => handleKpiClick('emails')}
          >
            <div className="text-2xl font-bold text-[#2166F0] mb-1">{readyEmails}</div>
            <div className="text-xs uppercase text-gray-600 dark:text-gray-400 tracking-wide">E-mails</div>
          </div>
          
          <div 
            className="text-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            onClick={() => handleKpiClick('clients')}
          >
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
