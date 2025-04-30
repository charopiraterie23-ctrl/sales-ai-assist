
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

  return (
    <Layout title="Clients" showFAB={false}>
      <div className="space-y-5">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="sticky top-[64px] z-10 bg-white dark:bg-gray-900 pt-4 pb-3 px-1 rounded-b-3xl shadow-sm"
        >
          <motion.div variants={itemVariants}>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Rechercher un client..."
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
          </motion.div>
          
          <motion.div variants={itemVariants} className="mb-3">
            <Tabs defaultValue={activeFilter} onValueChange={handleTabChange} className="w-full">
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
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenFilterSheet}
                className="flex items-center gap-1 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700"
              >
                <SlidersHorizontal size={14} />
                <span>Filtres</span>
                {hasActiveAdvancedFilters && (
                  <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
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
                className="flex items-center gap-1 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700"
              >
                <span>Trier: {sortType === 'name' ? 'Nom' : 'Date'}</span>
              </Button>
            </div>
            
            <Button
              size="sm"
              className="rounded-xl bg-blue-600 hover:bg-blue-700"
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
                <VirtualizedClientList
                  clients={paginatedClients}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  isLoading={isLoading}
                  onPageChange={handlePageChange}
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
