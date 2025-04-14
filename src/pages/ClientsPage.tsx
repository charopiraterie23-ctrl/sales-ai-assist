
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ClientCard from '@/components/cards/ClientCard';
import Layout from '@/components/layout/Layout';

const ClientsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
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
        
        <div>
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
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
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? "Aucun client trouvé" : "Aucun client disponible"}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ClientsPage;
