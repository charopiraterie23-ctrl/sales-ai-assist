
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
  const sizeClasses = size === 'sm' ? "text-xs px-2.5 py-1" : "text-sm px-3 py-1.5";
  
  const getStatusConfig = () => {
    switch (status) {
      case 'lead':
        return {
          classes: "bg-gradient-to-r from-blue-500/20 to-blue-400/20 text-blue-700 dark:text-blue-300",
          icon: <Circle className="w-3 h-3 fill-blue-500" />
        };
      case 'intéressé':
        return {
          classes: "bg-gradient-to-r from-green-500/20 to-green-400/20 text-green-700 dark:text-green-300",
          icon: <CheckCircle className="w-3 h-3 text-green-500" />
        };
      case 'en attente':
        return {
          classes: "bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 text-yellow-700 dark:text-yellow-300",
          icon: <Clock className="w-3 h-3 text-yellow-500" />
        };
      case 'conclu':
        return {
          classes: "bg-gradient-to-r from-purple-500/20 to-purple-400/20 text-purple-700 dark:text-purple-300",
          icon: <Award className="w-3 h-3 text-purple-500" />
        };
      case 'perdu':
        return {
          classes: "bg-gradient-to-r from-red-500/20 to-red-400/20 text-red-700 dark:text-red-300",
          icon: <XCircle className="w-3 h-3 text-red-500" />
        };
      default:
        return {
          classes: "bg-gradient-to-r from-gray-500/20 to-gray-400/20 text-gray-700 dark:text-gray-300",
          icon: <Circle className="w-3 h-3 text-gray-500" />
        };
    }
  };
  
  const { classes, icon } = getStatusConfig();
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <Badge variant="outline" className={cn(baseClasses, sizeClasses, classes, "rounded-full border-none shadow-sm")}>
      {icon}
      {label}
    </Badge>
  );
};

export default ClientStatusBadge;
