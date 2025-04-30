
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, FileText, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const MobileNavbar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
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
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-100/50 dark:border-gray-800/50 px-4 py-3 z-50 shadow-lg rounded-t-3xl"
        >
          <div className="grid grid-cols-3 gap-1 max-w-md mx-auto relative">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-3 rounded-xl font-medium transition-all duration-300',
                  activeTab === item.path
                    ? 'text-white dark:text-white bg-gradient-to-br from-nexentry-blue to-nexentry-blue-vivid shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:text-nexentry-blue dark:hover:text-nexentry-blue-light'
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
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0.5 rounded-full h-1 w-12 bg-white/30 dark:bg-white/30"
                    style={{ left: `calc(33.333% * ${navItems.indexOf(item)} + 16.666% - 24px)` }}
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </div>
          
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1, y: -2 }}
              className="bg-gradient-to-r from-nexentry-blue to-nexentry-blue-vivid text-white p-3 rounded-full shadow-lg"
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
