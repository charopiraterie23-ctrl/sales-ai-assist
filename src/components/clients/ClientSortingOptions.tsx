
import { Button } from '@/components/ui/button';
import { Filter, ArrowUp, ArrowDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClientSortingOptionsProps {
  sortType: string;
  sortDirection: 'asc' | 'desc';
  handleSort: (type: string) => void;
  onOpenFilters: () => void;
  hasActiveFilters: boolean;
}

const ClientSortingOptions = ({ 
  sortType, 
  sortDirection, 
  handleSort,
  onOpenFilters,
  hasActiveFilters
}: ClientSortingOptionsProps) => {
  return (
    <div className="flex items-center justify-between mt-3">
      <Button 
        variant={hasActiveFilters ? "default" : "outline"} 
        size="sm" 
        className="flex items-center gap-2 h-9 px-4"
        onClick={onOpenFilters}
      >
        <Filter className="h-4 w-4" /> Filtres
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2 h-9 px-4">
            Trier par
            {sortDirection === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[180px]">
          <DropdownMenuItem onClick={() => handleSort('name')} className="gap-2 justify-between">
            Nom {sortType === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort('lastContacted')} className="gap-2 justify-between">
            Dernier contact {sortType === 'lastContacted' && (sortDirection === 'asc' ? '↑' : '↓')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort('status')} className="gap-2 justify-between">
            Statut {sortType === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ClientSortingOptions;
