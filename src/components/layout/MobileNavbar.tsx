
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, FileText, Bell, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const MobileNavbar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 80) {
          setVisible(false);
        } else {
          setVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const navItems = [
    {
      path: '/dashboard',
      label: 'Accueil',
      icon: <Home size={22} />,
    },
    {
      path: '/clients',
      label: 'Clients',
      icon: <Users size={22} />,
    },
    {
      path: '/calls',
      label: 'Sessions',
      icon: <FileText size={22} />,
    },
    {
      path: '/notifications',
      label: 'Notifs',
      icon: <Bell size={22} />,
    },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-2 z-50 shadow-lg rounded-t-3xl"
        >
          <div className="grid grid-cols-4 gap-1 max-w-md mx-auto relative">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-3 rounded-xl font-medium transition-all duration-300',
                  activeTab === item.path
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                )}
                onClick={() => setActiveTab(item.path)}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ y: -2 }}
                  className="mb-1"
                >
                  {item.icon}
                </motion.div>
                <span className="text-xs font-medium">{item.label}</span>
                {activeTab === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 rounded-full h-1 w-12 bg-blue-600 dark:bg-blue-400"
                    style={{ left: `calc(25% * ${navItems.indexOf(item)} + 12.5% - 24px)` }}
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </div>
          
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -2 }}
              className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ChevronUp size={20} />
            </motion.div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default MobileNavbar;
