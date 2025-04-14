
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { User, Building, Mail, Phone as PhoneIcon, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ClientCardProps {
  clientId: string;
  fullName: string;
  company?: string;
  email?: string;
  phone?: string;
  lastContacted?: Date;
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

const ClientCard = ({
  clientId,
  fullName,
  company,
  email,
  phone,
  lastContacted,
  status,
  onClick,
}: ClientCardProps) => {
  return (
    <div 
      className="nexentry-card mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-nexentry-blue text-white rounded-full flex items-center justify-center mr-3">
            <User size={18} />
          </div>
          <div>
            <h3 className="font-medium text-lg">{fullName}</h3>
            {company && (
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <Building size={12} className="mr-1" />
                {company}
              </div>
            )}
          </div>
        </div>
        <Badge variant="outline" className={cn('rounded-full px-2 py-0.5', statusColors[status])}>
          {status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        {email && (
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <Mail size={14} className="mr-1 flex-shrink-0" />
            <span className="truncate">{email}</span>
          </div>
        )}
        
        {phone && (
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <PhoneIcon size={14} className="mr-1 flex-shrink-0" />
            <span>{phone}</span>
          </div>
        )}
      </div>
      
      {lastContacted && (
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mt-2">
          <Clock size={12} className="mr-1" />
          Dernier contact: {formatDistanceToNow(lastContacted, { addSuffix: true, locale: fr })}
        </div>
      )}
    </div>
  );
};

export default ClientCard;
