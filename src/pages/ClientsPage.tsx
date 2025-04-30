
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Loader2, X, ArrowDown, ArrowUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ClientCard from '@/components/cards/ClientCard';
import Layout from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type ClientStatus = 'lead' | 'intéressé' | 'en attente' | 'conclu' | 'perdu' | 'all';

const ClientsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ClientStatus>('all');
  const [sortType, setSortType] = useState<string>('lastContacted');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Mock data for clients
  const clients = [
    {
      clientId: '1',
      fullName: 'Jean Dupont',
      company: 'ABC Technologies',
      email: 'jean.dupont@abctech.com',
      phone: '06 12 34 56 78',
      lastContacted: new Date(2023, 3, 15),
      status: 'intéressé' as const,
    },
    {
      clientId: '2',
      fullName: 'Marie Lefevre',
      company: 'Société Générale',
      email: 'marie.lefevre@societegenerale.com',
      phone: '07 23 45 67 89',
      lastContacted: new Date(2023, 3, 10),
      status: 'en attente' as const,
    },
    {
      clientId: '3',
      fullName: 'Thomas Martin',
      company: 'Tech Solutions',
      email: 'thomas.martin@techsolutions.fr',
      phone: '06 34 56 78 90',
      lastContacted: new Date(2023, 3, 5),
      status: 'conclu' as const,
    },
    {
      clientId: '4',
      fullName: 'Sophie Bernard',
      company: 'Startup Innovante',
      email: 'sophie.bernard@startup.io',
      phone: '07 45 67 89 01',
      lastContacted: new Date(2023, 2, 28),
      status: 'lead' as const,
    },
  ];

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Filter clients based on search query and active filter
  const filteredClients = clients.filter(client => {
    // Apply text search
    const matchesSearch = 
      searchQuery === '' || 
      client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply status filter
    const matchesFilter = activeFilter === 'all' || client.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortType === 'name') {
      return sortDirection === 'asc' 
        ? a.fullName.localeCompare(b.fullName)
        : b.fullName.localeCompare(a.fullName);
    } else if (sortType === 'lastContacted') {
      if (!a.lastContacted) return sortDirection === 'asc' ? -1 : 1;
      if (!b.lastContacted) return sortDirection === 'asc' ? 1 : -1;
      return sortDirection === 'asc'
        ? a.lastContacted.getTime() - b.lastContacted.getTime()
        : b.lastContacted.getTime() - a.lastContacted.getTime();
    } else if (sortType === 'status') {
      return sortDirection === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = sortedClients.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setIsLoading(true);
    // Simulate loading for pagination
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
    }, 300);
  };

  // Toggle sort direction and set sort type
  const handleSort = (type: string) => {
    if (sortType === type) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortType(type);
      setSortDirection('desc');
    }
  };

  const filterOptions: ClientStatus[] = ['all', 'lead', 'intéressé', 'en attente', 'conclu', 'perdu'];

  return (
    <Layout title="Clients" showFAB>
      <div className="space-y-6">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 pt-1 pb-2">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un client..."
              className="pl-9 pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-2.5"
                aria-label="Effacer la recherche"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          
          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto py-2 -mx-1 px-1 no-scrollbar">
            {filterOptions.map((status) => (
              <Badge
                key={status}
                variant={activeFilter === status ? "default" : "outline"}
                className={`cursor-pointer ${status === 'all' ? '' : ''}`}
                onClick={() => setActiveFilter(status)}
              >
                {status === 'all' ? 'Tous' : status}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" /> Filtres avancés
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh]">
                <SheetHeader>
                  <SheetTitle>Filtres avancés</SheetTitle>
                  <SheetDescription>
                    Affinez votre recherche avec des filtres supplémentaires.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  {/* Filter options would go here */}
                  <p className="text-sm text-gray-500">Options de filtrage à venir...</p>
                </div>
                <SheetFooter>
                  <Button>Appliquer les filtres</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  Trier par
                  {sortDirection === 'asc' ? (
                    <ArrowUp className="h-4 w-4 ml-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 ml-1" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSort('name')}>
                  Nom {sortType === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('lastContacted')}>
                  Dernier contact {sortType === 'lastContacted' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('status')}>
                  Statut {sortType === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg border">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {paginatedClients.length > 0 ? (
              <div className="space-y-3 animate-fade-in">
                {paginatedClients.map((client) => (
                  <ClientCard
                    key={client.clientId}
                    clientId={client.clientId}
                    fullName={client.fullName}
                    company={client.company}
                    email={client.email}
                    phone={client.phone}
                    lastContacted={client.lastContacted}
                    status={client.status}
                    onClick={() => navigate(`/client/${client.clientId}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 animate-fade-in">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchQuery || activeFilter !== 'all' 
                    ? "Aucun client ne correspond à votre recherche" 
                    : "Aucun client disponible"}
                </p>
                <Button onClick={() => navigate('/add-client')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un client
                </Button>
              </div>
            )}
            
            {/* Pagination component */}
            {sortedClients.length > itemsPerPage && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        isActive={currentPage === i + 1}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClientsPage;
