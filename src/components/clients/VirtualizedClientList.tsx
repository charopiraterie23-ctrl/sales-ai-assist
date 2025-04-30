
import { useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useNavigate } from 'react-router-dom';
import { ClientType } from '@/types/client';
import ClientCard from '@/components/cards/ClientCard';
import { useToast } from '@/hooks/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface VirtualizedClientListProps {
  clients: ClientType[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

const VirtualizedClientList = ({ 
  clients, 
  currentPage, 
  totalPages, 
  isLoading, 
  onPageChange 
}: VirtualizedClientListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );

  // Estimated height for each client card
  const itemHeight = 120;

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

  // Row renderer function for virtualized list
  const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const client = clients[index];
    if (!client) return null;

    return (
      <div style={{ ...style, padding: '0px 4px' }}>
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
      </div>
    );
  };

  return (
    <div>
      <div className="space-y-4 animate-fade-in pb-6 px-1">
        {clients.length > 0 && (
          <List
            height={Math.min(clients.length * itemHeight, windowHeight * 0.7)}
            itemCount={clients.length}
            itemSize={itemHeight}
            width="100%"
            className="scrollbar-none"
          >
            {Row}
          </List>
        )}
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

export default VirtualizedClientList;
