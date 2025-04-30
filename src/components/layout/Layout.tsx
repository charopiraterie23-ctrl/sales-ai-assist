
import { ReactNode } from 'react';
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
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header 
        title={title} 
        showBackButton={showBackButton} 
        onBackClick={onBackClick} 
        className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
      />
      
      <main className="flex-1 pb-20">
        <div className="mx-auto max-w-screen-lg">
          {children}
        </div>
      </main>
      
      {showNavbar && <MobileNavbar />}
      
      {showFAB && (
        <TooltipProvider delayDuration={700}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                aria-label="Nouveau résumé"
                className="fixed bottom-[84px] right-6 w-14 h-14 rounded-full shadow-md bg-[#2166F0] text-white z-40 hover:bg-blue-600 transition-colors flex items-center justify-center"
                onClick={() => window.location.href = '/record'}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nouveau résumé</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default Layout;
