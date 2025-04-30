
import { useNavigate } from 'react-router-dom';
import ClientCard from '@/components/cards/ClientCard';
import { ClientType } from '@/types/client';
import { useToast } from '@/hooks/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface ClientListProps {
  clients: ClientType[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

const ClientList = ({ clients, currentPage, totalPages, isLoading, onPageChange }: ClientListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <div>
      <div className="space-y-4 animate-fade-in pb-6 px-1">
        {clients.map((client) => (
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
      
      {/* Pagination component */}
      {totalPages > 1 && (
        <Pagination className="mt-8 pb-24">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  isActive={currentPage === i + 1}
                  onClick={() => onPageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ClientList;
