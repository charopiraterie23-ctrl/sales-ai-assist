
import { useState, useEffect } from 'react';
import { ClientType, ClientStatus } from '@/types/client';

export const useClientData = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ClientStatus>('all');
  const [sortType, setSortType] = useState<string>('lastContacted');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [clientCount, setClientCount] = useState<number>(123); // Simulated count
  
  // Mock data for clients
  const clients: ClientType[] = [
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
  ];

  // Filter clients based on search query and active filter
  const filteredClients = clients.filter(client => {
    // Apply text search
    const matchesSearch = 
      searchQuery === '' || 
      client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply status filter
    const matchesFilter = activeFilter === 'all' || client.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
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

  // Handle page change
  const handlePageChange = (page: number) => {
    setIsLoading(true);
    // Simulate loading for pagination
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
    }, 300);
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

  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = sortedClients.slice(startIndex, startIndex + itemsPerPage);

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
  };
};
