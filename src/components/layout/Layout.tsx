
import { ReactNode } from 'react';
import MobileNavbar from './MobileNavbar';
import Header from './Header';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        <div className="mx-auto p-4 max-w-screen-lg space-y-6">
          {children}
        </div>
      </main>
      
      {showNavbar && <MobileNavbar />}
      
      {showFAB && (
        <TooltipProvider delayDuration={700}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon"
                aria-label="Nouveau résumé"
                className="fixed bottom-[84px] right-6 w-14 h-14 rounded-full shadow-md bg-[#2166F0] text-white z-40 hover:bg-blue-600 transition-colors"
                onClick={() => window.location.href = '/record'}
              >
                <Plus size={24} />
              </Button>
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
