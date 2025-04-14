
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Phone, Mail, Building, Calendar, Tag, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '@/components/layout/Layout';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface Client {
  clientId: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  lastContacted: Date;
  status: 'lead' | 'intéressé' | 'en attente' | 'conclu';
}

interface Call {
  id: string;
  date: Date;
  duration: string;
  summary: string;
}

const ClientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch client details
    setTimeout(() => {
      // Mock data based on the ClientsPage mock data
      const foundClient = {
        clientId: '1',
        fullName: 'Jean Dupont',
        company: 'ABC Technologies',
        email: 'jean.dupont@abctech.com',
        phone: '06 12 34 56 78',
        lastContacted: new Date(2023, 3, 15),
        status: 'intéressé' as const,
      };
      
      const mockCalls = [
        {
          id: '1',
          date: new Date(2023, 3, 15),
          duration: '15:23',
          summary: 'Discussion initiale sur les besoins',
        },
        {
          id: '2',
          date: new Date(2023, 3, 1),
          duration: '08:45',
          summary: 'Présentation des fonctionnalités',
        }
      ];
      
      setClient(foundClient);
      setCalls(mockCalls);
      setIsLoading(false);
    }, 1200);
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'intéressé': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'en attente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'conclu': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Layout title="Détails du client">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => navigate('/clients')}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          
          {!isLoading && client && (
            <Button 
              variant="outline" 
              size="sm"
              className="gap-1"
              onClick={() => navigate(`/client/${id}/edit`)}
            >
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-60" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ) : client ? (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-background p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold text-gray-700">
                    {client.fullName.charAt(0)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                    client.status === 'intéressé' ? 'bg-green-500' : 
                    client.status === 'en attente' ? 'bg-yellow-500' : 
                    client.status === 'conclu' ? 'bg-purple-500' : 'bg-blue-500'
                  }`} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{client.fullName}</h2>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Building className="h-3.5 w-3.5 mr-1" />
                    {client.company}
                  </div>
                </div>
              </div>
              <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 bg-card p-4 rounded-lg border">
                <h3 className="font-medium text-sm text-muted-foreground">Informations de contact</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`tel:${client.phone}`} className="text-sm hover:underline">{client.phone}</a>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`mailto:${client.email}`} className="text-sm hover:underline">{client.email}</a>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Dernier contact: {formatDate(client.lastContacted)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 bg-card p-4 rounded-lg border">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm text-muted-foreground">Actions rapides</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Phone className="h-4 w-4" />
                    Appeler
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Mail className="h-4 w-4" />
                    Envoyer un email
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Créer une note
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Calendar className="h-4 w-4" />
                    Planifier
                  </Button>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="calls" className="mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="calls">Historique d'appels</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="emails">Emails</TabsTrigger>
              </TabsList>
              
              <TabsContent value="calls">
                {calls.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Durée</TableHead>
                        <TableHead>Résumé</TableHead>
                        <TableHead className="w-[100px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calls.map((call) => (
                        <TableRow key={call.id}>
                          <TableCell>{formatDate(call.date)}</TableCell>
                          <TableCell>{call.duration}</TableCell>
                          <TableCell className="max-w-xs truncate">{call.summary}</TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => navigate(`/call-summary/${call.id}`)}
                            >
                              Voir
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Alert>
                    <AlertTitle>Aucun appel enregistré</AlertTitle>
                    <AlertDescription>
                      Vous n'avez pas encore d'historique d'appels avec ce client.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
              
              <TabsContent value="notes">
                <Alert>
                  <AlertTitle>Aucune note</AlertTitle>
                  <AlertDescription>
                    Vous n'avez pas encore de notes pour ce client.
                  </AlertDescription>
                </Alert>
              </TabsContent>
              
              <TabsContent value="emails">
                <Alert>
                  <AlertTitle>Aucun email</AlertTitle>
                  <AlertDescription>
                    Vous n'avez pas encore d'historique d'emails avec ce client.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Alert variant="destructive">
            <AlertTitle>Client non trouvé</AlertTitle>
            <AlertDescription>
              Le client que vous recherchez n'existe pas ou a été supprimé.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Layout>
  );
};

export default ClientDetailsPage;
