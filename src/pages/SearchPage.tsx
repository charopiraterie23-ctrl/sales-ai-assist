
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ArrowLeft } from 'lucide-react';

// Mock data for search results
const mockClients = [
  { id: '1', name: 'Sophie Martin', company: 'Entreprise ABC', avatar: null },
  { id: '2', name: 'Jean Dupont', company: 'XYZ Solutions', avatar: null },
  { id: '3', name: 'Marc Dubois', company: 'Tech Innovations', avatar: null },
];

const mockSessions = [
  { id: '1', title: 'Appel de suivi Sophie Martin', date: '2025-04-28', tags: ['lead', 'important'] },
  { id: '2', title: 'Réunion Sophie projet ABC', date: '2025-04-20', tags: ['projet', 'planning'] },
  { id: '3', title: 'Présentation Sophie nouveau produit', date: '2025-04-15', tags: ['produit', 'vente'] },
];

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [clientResults, setClientResults] = useState<typeof mockClients>([]);
  const [sessionResults, setSessionResults] = useState<typeof mockSessions>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Simulate search
  useEffect(() => {
    if (query.length < 2) {
      setClientResults([]);
      setSessionResults([]);
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    const timer = setTimeout(() => {
      const lowercaseQuery = query.toLowerCase();
      
      const filteredClients = mockClients.filter(
        client => client.name.toLowerCase().includes(lowercaseQuery) || 
                  client.company.toLowerCase().includes(lowercaseQuery)
      );
      
      const filteredSessions = mockSessions.filter(
        session => session.title.toLowerCase().includes(lowercaseQuery) || 
                  session.tags.some(tag => tag.includes(lowercaseQuery))
      );
      
      setClientResults(filteredClients);
      setSessionResults(filteredSessions);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Layout title="" showNavbar={true} showBackButton={true} onBackClick={handleBack}>
      <div className="space-y-4 pb-20">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Rechercher contacts, sessions..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 py-6"
            autoFocus
          />
        </div>

        {query.length >= 2 && (
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tout</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
            </TabsList>
            
            {isLoading && (
              <div className="py-8 text-center text-gray-500">
                Recherche en cours...
              </div>
            )}
            
            {!isLoading && clientResults.length === 0 && sessionResults.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                Aucun résultat pour "{query}"
              </div>
            )}
            
            <TabsContent value="all">
              {clientResults.length > 0 && (
                <>
                  <h3 className="font-medium text-sm text-gray-500 mt-4 mb-2">Contacts</h3>
                  <div className="space-y-2">
                    {clientResults.map(client => (
                      <div 
                        key={client.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => navigate(`/client/${client.id}`)}
                      >
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.company}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {sessionResults.length > 0 && (
                <>
                  <h3 className="font-medium text-sm text-gray-500 mt-4 mb-2">Sessions</h3>
                  <div className="space-y-2">
                    {sessionResults.map(session => (
                      <div 
                        key={session.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => navigate(`/call-summary/${session.id}`)}
                      >
                        <div className="font-medium">{session.title}</div>
                        <div className="flex gap-1 mt-1">
                          {session.tags.map(tag => (
                            <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="contacts">
              {clientResults.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {clientResults.map(client => (
                    <div 
                      key={client.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/client/${client.id}`)}
                    >
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-gray-500">{client.company}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  Aucun contact trouvé
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="sessions">
              {sessionResults.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {sessionResults.map(session => (
                    <div 
                      key={session.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/call-summary/${session.id}`)}
                    >
                      <div className="font-medium">{session.title}</div>
                      <div className="text-xs text-gray-500">{new Date(session.date).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  Aucune session trouvée
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {query.length < 2 && (
          <div className="py-16 text-center text-gray-500">
            <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Saisissez au moins 2 caractères pour lancer la recherche</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
