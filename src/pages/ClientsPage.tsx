
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Plus, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import ClientSearch from '@/components/clients/ClientSearch';
import ClientFilters from '@/components/clients/ClientFilters';
import ClientSortingOptions from '@/components/clients/ClientSortingOptions';
import VirtualizedClientList from '@/components/clients/VirtualizedClientList';
import ClientEmptyState from '@/components/clients/ClientEmptyState';
import LoadingSkeleton from '@/components/clients/LoadingSkeleton';
import AddClientFab from '@/components/clients/AddClientFab';
import AdvancedFilterSheet from '@/components/clients/AdvancedFilterSheet';
import { useClientData } from '@/hooks/useClientData';
import { AnimatePresence } from 'framer-motion';
import { ClientStatus } from '@/types/client';
import ClientList from '@/components/clients/ClientList';

const ClientsPage = () => {
  const navigate = useNavigate();
  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    isLoading,
    activeFilter,
    setActiveFilter,
    sortType,
    sortDirection,
    paginatedClients,
    totalPages,
    handlePageChange,
    handleSort,
    advancedFilters,
    handleAdvancedFilters,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    hasActiveAdvancedFilters
  } = useClientData();

  const handleOpenFilterSheet = () => {
    setIsFilterSheetOpen(true);
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

  // Add this handler function to safely convert string to ClientStatus
  const handleTabChange = (value: string) => {
    setActiveFilter(value as ClientStatus);
  };

  const handleSwipeLeft = (clientId: string) => {
    console.log(`Call client: ${clientId}`);
    // Implementation for calling
  };

  const handleSwipeRight = (clientId: string) => {
    console.log(`Message client: ${clientId}`);
    // Implementation for messaging
  };

  return (
    <Layout title="Clients" showFAB={false}>
      <div className="space-y-5">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="sticky top-[64px] z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl pt-4 pb-3 px-1 rounded-b-3xl shadow-sm"
        >
          <motion.div variants={itemVariants}>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Rechercher un client..."
                className="pl-10 pr-10 bg-gray-50 dark:bg-gray-800 border-gray-100/50 dark:border-gray-700/50 h-12 rounded-xl shadow-sm focus:shadow-md transition-shadow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <motion.button 
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery('')}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} />
                </motion.button>
              )}
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mb-4">
            <Tabs defaultValue={activeFilter} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full bg-gray-50 dark:bg-gray-800 p-1.5 rounded-xl shadow-sm">
                <TabsTrigger
                  value="all"
                  className="flex-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-nexentry-purple data-[state=active]:to-nexentry-purple-vivid data-[state=active]:text-white dark:data-[state=active]:from-nexentry-purple dark:data-[state=active]:to-nexentry-purple-vivid dark:data-[state=active]:text-white"
                >
                  Tous
                </TabsTrigger>
                <TabsTrigger
                  value="lead"
                  className="flex-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-nexentry-purple data-[state=active]:to-nexentry-purple-vivid data-[state=active]:text-white dark:data-[state=active]:from-nexentry-purple dark:data-[state=active]:to-nexentry-purple-vivid dark:data-[state=active]:text-white"
                >
                  Leads
                </TabsTrigger>
                <TabsTrigger
                  value="intéressé"
                  className="flex-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-nexentry-purple data-[state=active]:to-nexentry-purple-vivid data-[state=active]:text-white dark:data-[state=active]:from-nexentry-purple dark:data-[state=active]:to-nexentry-purple-vivid dark:data-[state=active]:text-white"
                >
                  Intéressés
                </TabsTrigger>
                <TabsTrigger
                  value="en attente"
                  className="flex-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-nexentry-purple data-[state=active]:to-nexentry-purple-vivid data-[state=active]:text-white dark:data-[state=active]:from-nexentry-purple dark:data-[state=active]:to-nexentry-purple-vivid dark:data-[state=active]:text-white"
                >
                  En attente
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenFilterSheet}
                className="flex items-center gap-1 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-100/50 dark:border-gray-700/50 h-10 shadow-sm"
              >
                <SlidersHorizontal size={14} />
                <span>Filtres</span>
                {hasActiveAdvancedFilters && (
                  <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-nexentry-purple">
                    {Object.keys(advancedFilters).filter(key => 
                      advancedFilters[key] !== '' && advancedFilters[key] !== null
                    ).length}
                  </Badge>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort(sortType === 'name' ? 'date' : 'name')}
                className="flex items-center gap-1 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-100/50 dark:border-gray-700/50 h-10 shadow-sm"
              >
                <span>Trier: {sortType === 'name' ? 'Nom' : 'Date'}</span>
              </Button>
            </div>
            
            <Button
              size="sm"
              className="rounded-xl bg-gradient-to-r from-nexentry-purple to-nexentry-purple-vivid hover:from-nexentry-purple-vivid hover:to-nexentry-purple shadow-sm h-10"
              onClick={() => navigate('/clients/add')}
            >
              <Plus size={16} className="mr-1" />
              Ajouter
            </Button>
          </motion.div>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LoadingSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {paginatedClients.length > 0 ? (
                <ClientList 
                  clients={paginatedClients}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                />
              ) : (
                <ClientEmptyState 
                  searchQuery={searchQuery} 
                  activeFilter={activeFilter} 
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AdvancedFilterSheet
        open={isFilterSheetOpen}
        onOpenChange={setIsFilterSheetOpen}
        filters={advancedFilters}
        onApplyFilters={handleAdvancedFilters}
      />
      
      <AddClientFab />
    </Layout>
  );
};

export default ClientsPage;
