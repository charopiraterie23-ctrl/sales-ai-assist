
import { useNavigate } from 'react-router-dom';
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
import { AnimatePresence, motion } from 'framer-motion';

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

  return (
    <Layout title="Clients" showFAB={false}>
      <div className="space-y-5">
        {/* Sticky search and filters container */}
        <div className="sticky top-[57px] z-10 bg-white dark:bg-gray-900 pt-4 pb-3">
          <ClientSearch 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
          
          <ClientFilters 
            activeFilter={activeFilter} 
            setActiveFilter={setActiveFilter} 
          />
          
          <ClientSortingOptions 
            sortType={sortType} 
            sortDirection={sortDirection} 
            handleSort={handleSort}
            onOpenFilters={handleOpenFilterSheet}
            hasActiveFilters={hasActiveAdvancedFilters}
          />
        </div>
        
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
