
import { Button } from '@/components/ui/button';
import { Filter, ArrowUp, ArrowDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ClientSortingOptionsProps {
  sortType: string;
  sortDirection: 'asc' | 'desc';
  handleSort: (type: string) => void;
}

const ClientSortingOptions = ({ sortType, sortDirection, handleSort }: ClientSortingOptionsProps) => {
  return (
    <div className="flex items-center justify-between mt-3">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2 h-9 px-4">
            <Filter className="h-4 w-4" /> Filtres
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[70vh]">
          <SheetHeader className="pb-2">
            <SheetTitle>Filtres avancés</SheetTitle>
            <SheetDescription>
              Affinez votre recherche avec des filtres supplémentaires.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <p className="text-sm text-gray-500">Options de filtrage à venir...</p>
          </div>
          <SheetFooter>
            <Button className="w-full sm:w-auto">Appliquer les filtres</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
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
