
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import MobileNavbar from './MobileNavbar';
import Header from './Header';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LayoutProps {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showNavbar?: boolean;
  showFAB?: boolean;
}

const Layout = ({ 
  children, 
  title, 
  showBackButton = false, 
  onBackClick, 
  showNavbar = true,
  showFAB = false
}: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-900">
      <Header 
        title={title} 
        showBackButton={showBackButton} 
        onBackClick={onBackClick} 
        className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl"
      />
      
      <motion.main 
        className="flex-1 pb-24 px-3 sm:px-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto max-w-screen-lg pt-4">
          {children}
        </div>
      </motion.main>
      
      {showNavbar && <MobileNavbar />}
      
      {showFAB && (
        <TooltipProvider delayDuration={700}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button 
                aria-label="Nouveau résumé"
                className="fixed bottom-[84px] right-6 w-16 h-16 rounded-full shadow-lg bg-gradient-to-br from-nexentry-purple to-nexentry-purple-vivid text-white z-40 flex items-center justify-center"
                onClick={() => window.location.href = '/record'}
                whileHover={{ scale: 1.08, boxShadow: "0 15px 30px rgba(155, 135, 245, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-nexentry-purple text-white border-none shadow-lg">
              <p>Nouveau résumé</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default Layout;
