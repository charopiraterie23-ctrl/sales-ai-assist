
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const HeaderMinimal: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <header className="border-b border-gray-100 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent">
          nexentry
        </Link>
        
        <Button variant="outline" asChild>
          <Link to={user ? "/dashboard" : "/login"}>
            {user ? "Mon compte" : "Connexion"}
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default HeaderMinimal;
