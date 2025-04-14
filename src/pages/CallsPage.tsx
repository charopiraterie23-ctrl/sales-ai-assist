
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CallCard from '@/components/cards/CallCard';
import Layout from '@/components/layout/Layout';

const CallsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for calls
  const calls = [
    {
      callId: '1',
      clientName: 'Jean Dupont - ABC Technologies',
      date: new Date(2023, 3, 15, 14, 30),
      duration: 840, // 14 minutes
      tags: ['prix', 'besoins', 'timing'],
      status: 'intéressé' as const,
    },
    {
      callId: '2',
      clientName: 'Marie Lefevre - Société Générale',
      date: new Date(2023, 3, 10, 10, 15),
      duration: 1260, // 21 minutes
      tags: ['objections', 'concurrents'],
      status: 'en attente' as const,
    },
    {
      callId: '3',
      clientName: 'Thomas Martin - Tech Solutions',
      date: new Date(2023, 3, 5, 16, 45),
      duration: 720, // 12 minutes
      tags: ['budget', 'prix'],
      status: 'conclu' as const,
    },
    {
      callId: '4',
      clientName: 'Sophie Bernard - Startup Innovante',
      date: new Date(2023, 2, 28, 11, 0),
      duration: 540, // 9 minutes
      tags: ['besoins'],
      status: 'lead' as const,
    },
  ];

  // Filter calls based on search query
  const filteredCalls = calls.filter(call => 
    call.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Layout title="Appels">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un appel..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => navigate('/record')}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div>
          {filteredCalls.length > 0 ? (
            filteredCalls.map((call) => (
              <CallCard
                key={call.callId}
                callId={call.callId}
                clientName={call.clientName}
                date={call.date}
                duration={call.duration}
                tags={call.tags}
                status={call.status}
                onClick={() => navigate(`/call-summary/${call.callId}`)}
              />
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? "Aucun appel trouvé" : "Aucun appel disponible"}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CallsPage;
