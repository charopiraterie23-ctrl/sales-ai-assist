
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserMenu from './UserMenu';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
}

const Header = ({ title, showBackButton = false, onBackClick, className }: HeaderProps) => {
  const navigate = useNavigate();
  
  const handleSearchClick = () => {
    navigate('/search');
  };
  
  return (
    <header className={`sticky top-0 z-50 w-full bg-gray-900/80 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/30 dark:border-gray-800/30 px-4 py-4 ${className ?? ''}`}>
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onBackClick}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
          )}
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-white"
          >
            {title}
          </motion.h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearchClick}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white shadow-sm"
          >
            <Search className="h-5 w-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white shadow-sm"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-gray-900 animate-pulse-soft"></span>
          </motion.button>
          
          <ThemeToggle />
          
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
