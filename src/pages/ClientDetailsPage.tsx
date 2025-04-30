
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Phone, Mail, Building, Calendar, Tag, MessageSquare, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import ClientAvatar from '@/components/cards/ClientAvatar';

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
  const [activeTab, setActiveTab] = useState('calls');

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
      case 'lead': return 'bg-blue-500';
      case 'intéressé': return 'bg-green-500';
      case 'en attente': return 'bg-yellow-500';
      case 'conclu': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout title="Détails du client" showBackButton={true} onBackClick={() => navigate('/clients')}>
      <motion.div 
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {isLoading ? (
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-60" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </div>
        ) : client ? (
          <>
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <ClientAvatar fullName={client.fullName} size="lg" />
                
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                    <h2 className="text-2xl font-bold">{client.fullName}</h2>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(client.status)}`}></div>
                      <span className="text-sm font-medium capitalize">
                        {client.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center sm:justify-start text-gray-600 dark:text-gray-300 mb-4">
                    <Building className="h-4 w-4 mr-1" />
                    {client.company}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="gap-2 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                      onClick={() => window.location.href = `tel:${client.phone}`}
                    >
                      <Phone className="h-4 w-4" />
                      Appeler
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="gap-2 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
                      onClick={() => window.location.href = `mailto:${client.email}`}
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-medium mb-3">Informations de contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
                        <Phone className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Téléphone</div>
                        <a href={`tel:${client.phone}`} className="font-medium hover:underline">{client.phone}</a>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg mr-3">
                        <Mail className="h-5 w-5 text-green-700 dark:text-green-300" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                        <a href={`mailto:${client.email}`} className="font-medium hover:underline break-all">{client.email}</a>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg mr-3">
                        <Calendar className="h-5 w-5 text-amber-700 dark:text-amber-300" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Dernier contact</div>
                        <div className="font-medium">{formatDate(client.lastContacted)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-medium mb-3">Actions rapides</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-auto py-3 justify-start gap-3 text-left">
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-purple-700 dark:text-purple-300" />
                      </div>
                      <div>
                        <div className="font-medium">Créer une note</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Ajouter des informations</div>
                      </div>
                    </Button>
                    
                    <Button variant="outline" className="h-auto py-3 justify-start gap-3 text-left">
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg">
                        <Calendar className="h-5 w-5 text-orange-700 dark:text-orange-300" />
                      </div>
                      <div>
                        <div className="font-medium">Planifier</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Rendez-vous</div>
                      </div>
                    </Button>
                    
                    <Button variant="outline" className="h-auto py-3 justify-start gap-3 text-left">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg">
                        <Share2 className="h-5 w-5 text-indigo-700 dark:text-indigo-300" />
                      </div>
                      <div>
                        <div className="font-medium">Partager</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Avec un collègue</div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto py-3 justify-start gap-3 text-left"
                      onClick={() => navigate(`/clients/${id}/edit`)}
                    >
                      <div className="bg-teal-50 dark:bg-teal-900/20 p-2 rounded-lg">
                        <Edit className="h-5 w-5 text-teal-700 dark:text-teal-300" />
                      </div>
                      <div>
                        <div className="font-medium">Modifier</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Infos client</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="px-4 pt-4">
                    <TabsList className="w-full bg-gray-50 dark:bg-gray-700/50 p-1 rounded-lg">
                      <TabsTrigger value="calls" className="flex-1 rounded-md">Appels</TabsTrigger>
                      <TabsTrigger value="notes" className="flex-1 rounded-md">Notes</TabsTrigger>
                      <TabsTrigger value="emails" className="flex-1 rounded-md">Emails</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="p-4">
                    <TabsContent value="calls" className="mt-0">
                      {calls.length > 0 ? (
                        <div className="space-y-3">
                          {calls.map((call) => (
                            <div 
                              key={call.id}
                              className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                              onClick={() => navigate(`/calls/${call.id}`)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {formatDate(call.date)}
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                                  {call.duration}
                                </div>
                              </div>
                              <p className="text-sm">{call.summary}</p>
                              <div className="flex justify-end mt-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                  Voir détails
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
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
                  </div>
                </Tabs>
              </div>
            </motion.div>
          </>
        ) : (
          <Alert variant="destructive">
            <AlertTitle>Client non trouvé</AlertTitle>
            <AlertDescription>
              Le client que vous recherchez n'existe pas ou a été supprimé.
            </AlertDescription>
          </Alert>
        )}
      </motion.div>
    </Layout>
  );
};

export default ClientDetailsPage;
