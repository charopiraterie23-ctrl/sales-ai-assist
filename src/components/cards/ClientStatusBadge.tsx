
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ClientStatus = 'lead' | 'intéressé' | 'en attente' | 'conclu' | 'perdu';

interface ClientStatusBadgeProps {
  status: ClientStatus;
}

const statusColors = {
  lead: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300',
  intéressé: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300',
  'en attente': 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300',
  conclu: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300',
  perdu: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300',
};

const ClientStatusBadge = ({ status }: ClientStatusBadgeProps) => {
  return (
    <Badge variant="outline" className={cn('rounded-full px-2 py-0.5 text-xs border', statusColors[status])}>
      {status}
    </Badge>
  );
};

export default ClientStatusBadge;
