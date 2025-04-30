
import { useState, useEffect, useMemo } from 'react';
import { ClientType, ClientStatus } from '@/types/client';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FilterOptions {
  status: ClientStatus | 'all';
  lastContactedDays: number | null;
  lastContactedCustomRange: {
    from: Date | undefined;
    to: Date | undefined;
  } | null;
  hasEmail: boolean | null;
  hasPhone: boolean | null;
}

const defaultFilters: FilterOptions = {
  status: 'all',
  lastContactedDays: null,
  lastContactedCustomRange: null,
  hasEmail: null,
  hasPhone: null
};

export const useClientData = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ClientStatus>('all');
  const [sortType, setSortType] = useState<string>('lastContacted');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [clients, setClients] = useState<ClientType[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>(defaultFilters);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  // Fetch clients from Supabase
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        // Convert the data to match our ClientType
        const formattedClients: ClientType[] = data.map(client => ({
          clientId: client.id,
          fullName: client.full_name,
          company: client.company || undefined,
          email: client.email || undefined,
          phone: client.phone || undefined,
          lastContacted: client.last_contacted ? new Date(client.last_contacted) : undefined,
          status: client.status as Exclude<ClientStatus, 'all'>
        }));
        
        setClients(formattedClients);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les clients",
        });
        
        // Fallback to mock data if we can't fetch from Supabase
        setClients([
          {
            clientId: '1',
            fullName: 'Jean Dupont',
            company: 'ABC Technologies',
            email: 'jean.dupont@abctech.com',
            phone: '06 12 34 56 78',
            lastContacted: new Date(2023, 3, 15),
            status: 'intéressé',
          },
          {
            clientId: '2',
            fullName: 'Marie Lefevre',
            company: 'Société Générale',
            email: 'marie.lefevre@societegenerale.com',
            phone: '07 23 45 67 89',
            lastContacted: new Date(2023, 3, 10),
            status: 'en attente',
          },
          {
            clientId: '3',
            fullName: 'Thomas Martin',
            company: 'Tech Solutions',
            email: 'thomas.martin@techsolutions.fr',
            phone: '06 34 56 78 90',
            lastContacted: new Date(2023, 3, 5),
            status: 'conclu',
          },
          {
            clientId: '4',
            fullName: 'Sophie Bernard',
            company: 'Startup Innovante',
            email: 'sophie.bernard@startup.io',
            phone: '07 45 67 89 01',
            lastContacted: new Date(2023, 2, 28),
            status: 'lead',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, [toast]);
  
  // Apply advanced filters
  const applyAdvancedFilters = (client: ClientType): boolean => {
    // Status filter from the advanced filters
    if (advancedFilters.status !== 'all' && client.status !== advancedFilters.status) {
      return false;
    }
    
    // Last contacted days filter
    if (advancedFilters.lastContactedDays && client.lastContacted) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - advancedFilters.lastContactedDays);
      if (client.lastContacted < daysAgo) {
        return false;
      }
    }
    
    // Custom date range filter
    if (advancedFilters.lastContactedCustomRange && client.lastContacted) {
      const { from, to } = advancedFilters.lastContactedCustomRange;
      if (from && client.lastContacted < from) {
        return false;
      }
      if (to) {
        // Add one day to 'to' date to include the entire day
        const endDate = new Date(to);
        endDate.setDate(endDate.getDate() + 1);
        if (client.lastContacted > endDate) {
          return false;
        }
      }
    }
    
    // Has email filter
    if (advancedFilters.hasEmail !== null) {
      const hasEmail = !!client.email;
      if (hasEmail !== advancedFilters.hasEmail) {
        return false;
      }
    }
    
    // Has phone filter
    if (advancedFilters.hasPhone !== null) {
      const hasPhone = !!client.phone;
      if (hasPhone !== advancedFilters.hasPhone) {
        return false;
      }
    }
    
    return true;
  };

  // Combined filtering (simple + advanced)
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      // Apply text search
      const matchesSearch = 
        searchQuery === '' || 
        client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Apply basic filter (from filter chips)
      const matchesBasicFilter = activeFilter === 'all' || client.status === activeFilter;
      
      // Apply advanced filters
      const matchesAdvancedFilters = applyAdvancedFilters(client);
      
      return matchesSearch && matchesBasicFilter && matchesAdvancedFilters;
    });
  }, [clients, searchQuery, activeFilter, advancedFilters]);

  // Apply sorting
  const sortedClients = useMemo(() => {
    return [...filteredClients].sort((a, b) => {
      if (sortType === 'name') {
        return sortDirection === 'asc' 
          ? a.fullName.localeCompare(b.fullName)
          : b.fullName.localeCompare(a.fullName);
      } else if (sortType === 'lastContacted') {
        if (!a.lastContacted) return sortDirection === 'asc' ? -1 : 1;
        if (!b.lastContacted) return sortDirection === 'asc' ? 1 : -1;
        return sortDirection === 'asc'
          ? a.lastContacted.getTime() - b.lastContacted.getTime()
          : b.lastContacted.getTime() - a.lastContacted.getTime();
      } else if (sortType === 'status') {
        return sortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });
  }, [filteredClients, sortType, sortDirection]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setIsLoading(true);
    // Simulate loading for pagination
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
      // Scroll to top when changing pages
      window.scrollTo(0, 0);
    }, 200);
  };

  // Toggle sort direction and set sort type
  const handleSort = (type: string) => {
    if (sortType === type) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortType(type);
      setSortDirection('desc');
    }
  };

  // Handle advanced filtering
  const handleAdvancedFilters = (filters: FilterOptions) => {
    setAdvancedFilters(filters);
    // Reset to first page when applying new filters
    setCurrentPage(1);
  };

  const itemsPerPage = 15; // Increased for smoother virtualized scrolling
  const totalPages = Math.max(1, Math.ceil(sortedClients.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = sortedClients.slice(startIndex, startIndex + itemsPerPage);
  
  // Check if any advanced filters are active
  const hasActiveAdvancedFilters = useMemo(() => {
    return (
      advancedFilters.status !== 'all' ||
      advancedFilters.lastContactedDays !== null ||
      advancedFilters.lastContactedCustomRange !== null ||
      advancedFilters.hasEmail !== null ||
      advancedFilters.hasPhone !== null
    );
  }, [advancedFilters]);

  return {
    searchQuery,
    setSearchQuery,
    currentPage,
    isLoading,
    activeFilter,
    setActiveFilter,
    sortType,
    sortDirection,
    sortedClients,
    paginatedClients,
    totalPages,
    handlePageChange,
    handleSort,
    itemsPerPage,
    advancedFilters,
    handleAdvancedFilters,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    hasActiveAdvancedFilters
  };
};
