
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mic, Users, Phone, Home, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNavbar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const navItems = [
    {
      path: '/dashboard',
      label: 'Accueil',
      icon: <Home size={20} />,
    },
    {
      path: '/record',
      label: 'Nouveau',
      icon: <Mic size={20} />,
    },
    {
      path: '/clients',
      label: 'Contacts',
      icon: <Users size={20} />,
    },
    {
      path: '/calls',
      label: 'Résumés',
      icon: <Phone size={20} />,
    },
    {
      path: '/settings',
      label: 'Paramètres',
      icon: <Settings size={20} />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-nexentry-blue-dark border-t border-gray-200 dark:border-gray-800 px-2 pb-1 pt-2 z-50">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs font-medium transition-colors',
              activeTab === item.path
                ? 'text-nexentry-blue dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-nexentry-blue dark:hover:text-white'
            )}
            onClick={() => setActiveTab(item.path)}
          >
            {item.icon}
            <span className="mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavbar;
