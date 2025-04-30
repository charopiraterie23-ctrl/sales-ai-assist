
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ClientSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ClientSearch = ({ searchQuery, setSearchQuery }: ClientSearchProps) => {
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative mb-3">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Rechercher un client..."
        className="pl-9 pr-8 py-5 h-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-2.5"
          aria-label="Effacer la recherche"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      )}
    </div>
  );
};

export default ClientSearch;
