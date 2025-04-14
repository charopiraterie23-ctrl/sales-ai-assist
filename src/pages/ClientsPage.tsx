
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ClientCard from '@/components/cards/ClientCard';
import Layout from '@/components/layout/Layout';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const ClientsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
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

  // Filter clients based on search query
  const filteredClients = clients.filter(client => 
    client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setIsLoading(true);
    // Simulate loading for pagination
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
    }, 300);
  };

  return (
    <Layout title="Clients">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un client..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => navigate('/add-client')}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
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
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? "Aucun client trouvé" : "Aucun client disponible"}
                </p>
              </div>
            )}
            
            {/* Pagination component */}
            {filteredClients.length > itemsPerPage && (
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
