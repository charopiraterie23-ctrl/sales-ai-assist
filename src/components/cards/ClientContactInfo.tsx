
import React from 'react';
import { Mail, Phone, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ClientContactInfoProps {
  email?: string;
  phone?: string;
  lastContacted?: Date;
}

const ClientContactInfo: React.FC<ClientContactInfoProps> = ({
  email,
  phone,
  lastContacted,
}) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) {
      return "Aujourd'hui";
    } else if (diff === 1) {
      return "Hier";
    } else if (diff < 7) {
      return `Il y a ${diff} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
      });
    }
  };

  const contactMethods = [
    email && {
      icon: <Mail className="h-3.5 w-3.5" />,
      value: email,
      action: () => window.location.href = `mailto:${email}`,
      ariaLabel: `Envoyer un email à ${email}`,
    },
    phone && {
      icon: <Phone className="h-3.5 w-3.5" />,
      value: phone,
      action: () => window.location.href = `tel:${phone}`,
      ariaLabel: `Appeler ${phone}`,
    },
  ].filter(Boolean);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {contactMethods.map((method, index) => (
          method && (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.02 }}
              className="flex items-center"
            >
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={method.action}
                aria-label={method.ariaLabel}
                className="h-auto py-1 px-2 flex items-center gap-1.5 text-xs font-normal justify-start text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {method.icon}
                <span className="truncate">{method.value}</span>
              </Button>
            </motion.div>
          )
        ))}
      </div>

      {lastContacted && (
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="h-3 w-3 mr-1.5" />
          <span>Dernier contact: {formatDate(lastContacted)}</span>
        </div>
      )}
    </div>
  );
};

export default ClientContactInfo;
