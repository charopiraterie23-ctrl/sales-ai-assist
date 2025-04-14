
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, User, Clock, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

interface Client {
  id: string;
  name: string;
  company?: string;
  lastContact: string;
}

interface RecentClientsCardProps {
  isLoading?: boolean;
  clients?: Client[];
  onLoadMore?: () => void;
  hasMoreClients?: boolean;
}

const RecentClientsCard = ({ 
  isLoading = false, 
  clients = [],
  onLoadMore,
  hasMoreClients = false
}: RecentClientsCardProps) => {
  const [page, setPage] = useState(1);
  
  // Clients par défaut si aucun n'est fourni
  const defaultClients: Client[] = [
    { id: '1', name: 'Marie Legrand', lastContact: '2 jours' },
    { id: '2', name: 'Thomas Bernard', lastContact: '5 jours' }
  ];
  
  const displayClients = clients.length > 0 ? clients : defaultClients;

  const handleNextPage = () => {
    if (onLoadMore) {
      onLoadMore();
    }
    setPage(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="animate-slide-up">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Clients récents</h3>
          <Button variant="ghost" size="sm" className="gap-1 text-nexentry-blue" asChild>
            <Link to="/clients">
              Voir tous <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayClients.map(client => (
          <div key={client.id} className="flex items-center justify-between py-2 border-b transition-colors hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="bg-nexentry-blue-light/20 rounded-full p-2">
                <User className="h-5 w-5 text-nexentry-blue" />
              </div>
              <div>
                <p className="font-medium">{client.name}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Dernier contact: {client.lastContact}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-nexentry-blue rounded-full" asChild>
              <Link to={`/clients/${client.id}`}>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        ))}
      </CardContent>
      {hasMoreClients && (
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-center" 
            onClick={handleNextPage}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Afficher plus de clients
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RecentClientsCard;
