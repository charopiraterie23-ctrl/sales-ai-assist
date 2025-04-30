
import { Mail, Phone as PhoneIcon, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientContactInfoProps {
  email?: string;
  phone?: string;
  lastContacted?: Date;
}

const ClientContactInfo = ({ email, phone, lastContacted }: ClientContactInfoProps) => {
  return (
    <>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
        {email && phone && (
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
            <Mail size={12} className="mr-1 flex-shrink-0" />
            <span className="mr-1 truncate max-w-[150px]">{email}</span>
            <span className="mx-1">•</span>
            <PhoneIcon size={12} className="mr-1 flex-shrink-0" />
            <span>{phone}</span>
          </div>
        )}
        {email && !phone && (
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
            <Mail size={12} className="mr-1 flex-shrink-0" />
            <span className="truncate">{email}</span>
          </div>
        )}
        {!email && phone && (
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
            <PhoneIcon size={12} className="mr-1 flex-shrink-0" />
            <span>{phone}</span>
          </div>
        )}
      </div>
      
      {lastContacted && (
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
          <Clock size={12} className="mr-1" />
          Dernier contact: {formatDistanceToNow(lastContacted, { addSuffix: true, locale: fr })}
        </div>
      )}
    </>
  );
};

export default ClientContactInfo;
