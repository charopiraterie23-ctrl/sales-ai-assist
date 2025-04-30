
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ClientEmptyStateProps {
  searchQuery: string;
  activeFilter: string;
}

const ClientEmptyState = ({ searchQuery, activeFilter }: ClientEmptyStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-14 animate-fade-in">
      <div className="mx-auto max-w-xs mb-6 opacity-70">
        <svg viewBox="0 0 24 24" fill="none" className="h-32 w-32 mx-auto text-gray-300">
          <path
            d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="font-medium text-xl mb-3">Aucun contact pour le moment</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {searchQuery || activeFilter !== 'all' 
          ? "Aucun client ne correspond à votre recherche" 
          : "Commencez par ajouter votre premier contact pour gérer votre relation client efficacement."}
      </p>
      <Button size="lg" onClick={() => navigate('/add-client')}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter votre premier contact
      </Button>
    </div>
  );
};

export default ClientEmptyState;
