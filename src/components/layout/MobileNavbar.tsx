
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNavbar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const navItems = [
    {
      path: '/dashboard',
      label: 'Accueil',
      icon: <Home size={22} />,
    },
    {
      path: '/clients',
      label: 'Contacts',
      icon: <Users size={22} />,
    },
    {
      path: '/calls',
      label: 'Sessions',
      icon: <FileText size={22} />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111827] border-t border-gray-200 dark:border-gray-800 px-6 py-3 z-50 shadow-[0_-2px_6px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-3 gap-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-3 rounded-lg font-medium transition-colors',
              activeTab === item.path
                ? 'text-[#2166F0] dark:text-white'
                : 'text-[#6B7280] dark:text-gray-400 hover:text-[#2166F0] dark:hover:text-white'
            )}
            onClick={() => setActiveTab(item.path)}
          >
            {item.icon}
            <span className="mt-1 text-[10px]">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavbar;
