
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Loader2, X, ArrowDown, ArrowUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ClientCard from '@/components/cards/ClientCard';
import Layout from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ClientStatus>('all');
  const [sortType, setSortType] = useState<string>('lastContacted');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [clientCount, setClientCount] = useState<number>(123); // Simulated count for demo
  const [freeQuota, setFreeQuota] = useState<number>(150); // Simulated quota limit
  
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
  
  const resetFilter = () => {
    setActiveFilter('all');
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
  
  // Handle client actions
  const handleCall = (clientId: string, name: string) => {
    toast({
      title: "Appel en cours",
      description: `Appel vers ${name}...`,
    });
  };
  
  const handleMessage = (clientId: string, name: string) => {
    toast({
      title: "Suivi client",
      description: `Préparation d'un message pour ${name}`,
    });
  };

  const filterOptions: ClientStatus[] = ['all', 'lead', 'intéressé', 'en attente', 'conclu', 'perdu'];

  const getChipLabel = (status: ClientStatus) => {
    return status === 'all' ? 'Tous' : status;
  };

  return (
    <Layout title="Clients" showFAB={false}>
      <div className="space-y-6">
        {/* Sticky search and filters container */}
        <div className="sticky top-[57px] z-10 bg-white dark:bg-gray-900 pt-1 pb-2">
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
          
          {/* Filter chips with horizontal scroll */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent dark:from-gray-900 z-10" />
            <ScrollArea orientation="horizontal" className="w-full pb-2">
              <div className="flex gap-2 py-2 px-1">
                {filterOptions.map((status) => (
                  <Badge
                    key={status}
                    variant={activeFilter === status ? "default" : "outline"}
                    className="cursor-pointer py-0 h-8 px-3 whitespace-nowrap flex items-center gap-1.5"
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
          
          {/* Filters and sort row */}
          <div className="flex items-center justify-between mt-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" /> Filtres
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
                  <p className="text-sm text-gray-500">Options de filtrage à venir...</p>
                </div>
                <SheetFooter>
                  <Button>Appliquer les filtres</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center">
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
            {[1, 2].map((i) => (
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
              <div className="space-y-3 animate-fade-in pb-20">
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
                    onSwipeLeft={() => handleCall(client.clientId, client.fullName)}
                    onSwipeRight={() => handleMessage(client.clientId, client.fullName)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 animate-fade-in">
                <div className="mx-auto max-w-xs mb-5 opacity-70">
                  <svg viewBox="0 0 24 24" fill="none" className="h-40 w-40 mx-auto text-gray-300">
                    <path
                      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-2">Aucun contact pour le moment</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                  {searchQuery || activeFilter !== 'all' 
                    ? "Aucun client ne correspond à votre recherche" 
                    : "Commencez par ajouter votre premier contact pour gérer votre relation client efficacement."}
                </p>
                <Button onClick={() => navigate('/add-client')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter votre premier contact
                </Button>
              </div>
            )}
            
            {/* Pagination component */}
            {sortedClients.length > itemsPerPage && (
              <Pagination className="mt-6 pb-20">
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
      
      {/* Custom FAB with counter */}
      {clientCount > 0 && (
        <div className="fixed bottom-[96px] right-6 z-40">
          {clientCount > freeQuota * 0.8 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 font-medium">
              {clientCount}/{freeQuota}
            </div>
          )}
          <Button 
            size="icon"
            aria-label="Nouveau client"
            className="w-14 h-14 rounded-full shadow-md bg-[#2166F0] text-white hover:bg-blue-600 transition-colors"
            onClick={() => navigate('/add-client')}
          >
            <Plus size={24} />
          </Button>
          {clientCount > freeQuota * 0.8 && (
            <div className="absolute top-16 right-0 bg-white dark:bg-gray-800 shadow-md rounded-md px-3 py-2 text-xs whitespace-nowrap">
              Passez Pro pour illimité
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default ClientsPage;
