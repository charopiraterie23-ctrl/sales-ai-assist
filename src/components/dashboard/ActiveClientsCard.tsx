
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ClientAvatar from '@/components/cards/ClientAvatar';

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
    <Card className="overflow-hidden nexentry-card">
      <CardContent className="pt-4 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold gradient-text">Clients actifs</h3>
        </div>
        
        <motion.div 
          className="space-y-2 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, staggerChildren: 0.1 }}
        >
          {mockClients.map((client, index) => (
            <motion.div 
              key={client.id}
              className="p-3 border border-gray-100/50 dark:border-gray-700/50 rounded-xl flex justify-between items-center bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-700/50 hover:shadow-md cursor-pointer transition-all duration-300"
              onClick={() => navigate(`/client/${client.id}`)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <ClientAvatar fullName={client.name} size="sm" />
                <div>
                  <div className="text-sm font-medium">{client.name}</div>
                  <div className="text-xs text-gray-500 flex gap-2">
                    <span>Dernier contact: {new Date(client.lastContact).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{client.sessions} sessions</span>
                  </div>
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse-soft"></div>
            </motion.div>
          ))}
        </motion.div>
        
        <Button 
          variant="outline" 
          className="w-full rounded-xl border-nexentry-purple/20 hover:bg-nexentry-purple/10 text-nexentry-purple" 
          onClick={() => navigate('/clients')}
        >
          Voir tous les clients
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActiveClientsCard;
