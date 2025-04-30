
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Circle, CheckCircle, Clock, Award, XCircle } from 'lucide-react';

interface ClientStatusBadgeProps {
  status: 'lead' | 'intéressé' | 'en attente' | 'conclu' | 'perdu';
  size?: 'sm' | 'md';
}

const ClientStatusBadge: React.FC<ClientStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const baseClasses = "font-medium flex items-center gap-1 whitespace-nowrap";
  const sizeClasses = size === 'sm' ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";
  
  const getStatusConfig = () => {
    switch (status) {
      case 'lead':
        return {
          classes: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
          icon: <Circle className="w-3 h-3 fill-current" />
        };
      case 'intéressé':
        return {
          classes: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
          icon: <CheckCircle className="w-3 h-3" />
        };
      case 'en attente':
        return {
          classes: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
          icon: <Clock className="w-3 h-3" />
        };
      case 'conclu':
        return {
          classes: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
          icon: <Award className="w-3 h-3" />
        };
      case 'perdu':
        return {
          classes: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
          icon: <XCircle className="w-3 h-3" />
        };
      default:
        return {
          classes: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
          icon: <Circle className="w-3 h-3" />
        };
    }
  };
  
  const { classes, icon } = getStatusConfig();
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <Badge variant="outline" className={cn(baseClasses, sizeClasses, classes, "rounded-full border-none")}>
      {icon}
      {label}
    </Badge>
  );
};

export default ClientStatusBadge;
