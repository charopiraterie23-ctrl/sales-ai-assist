
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ClientSearch from '@/components/clients/ClientSearch';
import ClientFilters from '@/components/clients/ClientFilters';
import ClientSortingOptions from '@/components/clients/ClientSortingOptions';
import ClientList from '@/components/clients/ClientList';
import ClientEmptyState from '@/components/clients/ClientEmptyState';
import LoadingSkeleton from '@/components/clients/LoadingSkeleton';
import AddClientFab from '@/components/clients/AddClientFab';
import { useClientData } from '@/hooks/useClientData';

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
  } = useClientData();

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
          />
        </div>
        
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div>
            {paginatedClients.length > 0 ? (
              <ClientList 
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
          </div>
        )}
      </div>
      
      <AddClientFab />
    </Layout>
  );
};

export default ClientsPage;
