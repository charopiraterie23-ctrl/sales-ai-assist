
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserMenu from './UserMenu';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const Header = ({ title, showBackButton = false, onBackClick }: HeaderProps) => {
  const navigate = useNavigate();
  
  const handleSearchClick = () => {
    navigate('/search');
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#111827]/80 border-b border-gray-200 dark:border-gray-800 px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.04)] backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              className="mr-2 p-0 h-8 w-8"
              onClick={onBackClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span className="sr-only">Retour</span>
            </Button>
          )}
          <h1 className="text-lg font-semibold text-[#111827] dark:text-white">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-[#6B7280] hover:text-[#111827]"
            aria-label="Recherche"
            onClick={handleSearchClick}
          >
            <Search size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-[#6B7280] hover:text-[#111827]"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
