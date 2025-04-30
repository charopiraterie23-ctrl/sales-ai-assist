
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: string;
  name: string;
  lastContact: string;
  sessions: number;
}

// Données factices pour les clients actifs
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Entreprise ABC',
    lastContact: '2025-04-28',
    sessions: 5
  },
  {
    id: '2',
    name: 'Startup XYZ',
    lastContact: '2025-04-25',
    sessions: 3
  },
  {
    id: '3',
    name: 'Association 123',
    lastContact: '2025-04-20',
    sessions: 2
  }
];

const ActiveClientsCard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Clients actifs</h3>
        </div>
        
        <div className="space-y-2 mb-4">
          {mockClients.map((client) => (
            <div 
              key={client.id}
              className="p-2 border border-gray-100 dark:border-gray-700 rounded-lg flex justify-between items-center"
              onClick={() => navigate(`/client/${client.id}`)}
            >
              <div>
                <div className="text-sm font-medium">{client.name}</div>
                <div className="text-xs text-gray-500 flex gap-2">
                  <span>Dernier contact: {new Date(client.lastContact).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{client.sessions} sessions</span>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate('/clients')}
        >
          Voir tous les clients
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActiveClientsCard;
