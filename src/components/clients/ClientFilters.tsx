
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

type ClientStatus = 'lead' | 'intéressé' | 'en attente' | 'conclu' | 'perdu' | 'all';

interface ClientFiltersProps {
  activeFilter: ClientStatus;
  setActiveFilter: (status: ClientStatus) => void;
}

const ClientFilters = ({ activeFilter, setActiveFilter }: ClientFiltersProps) => {
  const filterOptions: ClientStatus[] = ['all', 'lead', 'intéressé', 'en attente', 'conclu', 'perdu'];

  const getChipLabel = (status: ClientStatus) => {
    return status === 'all' ? 'Tous' : status;
  };

  const resetFilter = () => {
    setActiveFilter('all');
  };

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent dark:from-gray-900 z-10" />
      <ScrollArea className="w-full pb-2">
        <div className="flex gap-3 py-2 px-1">
          {filterOptions.map((status) => (
            <Badge
              key={status}
              variant={activeFilter === status ? "default" : "outline"}
              className="cursor-pointer py-0 h-8 px-4 whitespace-nowrap flex items-center gap-1.5"
              onClick={() => setActiveFilter(status)}
            >
              {getChipLabel(status)}
              {activeFilter === status && status !== 'all' && (
                <X 
                  className="h-3 w-3" 
                  onClick={(e) => {
                    e.stopPropagation();
                    resetFilter();
                  }}
                />
              )}
            </Badge>
          ))}
        </div>
      </ScrollArea>
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent dark:from-gray-900 z-10" />
    </div>
  );
};

export default ClientFilters;
