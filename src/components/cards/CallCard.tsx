
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Phone, Clock, Tag, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CallCardProps {
  callId: string;
  clientName: string;
  date: Date;
  duration: number;
  tags?: string[];
  status: 'lead' | 'intéressé' | 'en attente' | 'conclu' | 'perdu';
  onClick?: () => void;
}

const statusColors = {
  lead: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  intéressé: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  'en attente': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  conclu: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  perdu: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const CallCard = ({
  callId,
  clientName,
  date,
  duration,
  tags = [],
  status,
  onClick,
}: CallCardProps) => {
  // Format duration in minutes and seconds
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="nexentry-card mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-lg">{clientName}</h3>
        <Badge variant="outline" className={cn('rounded-full px-2 py-0.5', statusColors[status])}>
          {status}
        </Badge>
      </div>
      
      <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
        <Clock size={14} className="mr-1" />
        <span className="text-sm">{formatDistanceToNow(date, { addSuffix: true, locale: fr })}</span>
        
        <div className="mx-2 h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        
        <Phone size={14} className="mr-1" />
        <span className="text-sm">{formatDuration(duration)}</span>
      </div>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag) => (
            <div 
              key={tag} 
              className="flex items-center text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              <Tag size={10} className="mr-1" />
              {tag}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex justify-end">
        <ChevronRight size={16} className="text-gray-400" />
      </div>
    </div>
  );
};

export default CallCard;
