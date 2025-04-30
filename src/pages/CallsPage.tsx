
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, X, Calendar, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import CallCard from '@/components/cards/CallCard';

const CallsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
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

  // Filter calls based on search query and active filter
  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          call.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = activeFilter === 'all' || call.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

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
    <Layout title="Appels">
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          variants={itemVariants}
          className="sticky top-[64px] z-10 bg-white dark:bg-gray-900 pt-4 pb-3 rounded-b-3xl shadow-sm"
        >
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Rechercher un appel..."
              className="pl-10 pr-10 bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 h-10 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery('')}
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="mb-3">
            <Tabs defaultValue={activeFilter} onValueChange={setActiveFilter} className="w-full">
              <TabsList className="w-full bg-gray-50 dark:bg-gray-800 p-1 rounded-xl">
                <TabsTrigger
                  value="all"
                  className="flex-1 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  Tous
                </TabsTrigger>
                <TabsTrigger
                  value="lead"
                  className="flex-1 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  Leads
                </TabsTrigger>
                <TabsTrigger
                  value="intéressé"
                  className="flex-1 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  Intéressés
                </TabsTrigger>
                <TabsTrigger
                  value="en attente"
                  className="flex-1 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  En attente
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700"
            >
              <SlidersHorizontal size={14} />
              <span>Filtres</span>
            </Button>
            
            <Button
              size="sm"
              className="rounded-xl bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/record')}
            >
              <Plus size={16} className="mr-1" />
              Nouvel appel
            </Button>
          </div>
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {filteredCalls.length > 0 ? (
              filteredCalls.map((call) => (
                <motion.div
                  key={call.callId}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.2 }}
                >
                  <CallCard
                    callId={call.callId}
                    clientName={call.clientName}
                    date={call.date}
                    duration={call.duration}
                    tags={call.tags}
                    status={call.status}
                    onClick={() => navigate(`/calls/${call.callId}`)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div variants={itemVariants} className="text-center py-12">
                <div className="mx-auto bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">Aucun appel trouvé</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
                  {searchQuery ? "Aucun appel ne correspond à votre recherche" : "Enregistrez votre premier appel pour commencer"}
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate('/record')}
                >
                  <Plus size={16} className="mr-1" />
                  Créer votre premier appel
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

export default CallsPage;
