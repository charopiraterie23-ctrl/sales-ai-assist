
import { ReactNode } from 'react';
import MobileNavbar from './MobileNavbar';
import Header from './Header';

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
      />
      
      <main className="flex-1 pb-20">
        <div className="mx-auto p-4 max-w-screen-lg">
          {children}
        </div>
      </main>
      
      {showNavbar && <MobileNavbar />}
      
      {showFAB && (
        <button 
          aria-label="Ajouter une nouvelle session"
          className="fixed bottom-24 right-6 w-14 h-14 bg-[#2166F0] text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-blue-600 transition-colors"
          onClick={() => window.location.href = '/record'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Layout;
