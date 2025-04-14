
import { ReactNode } from 'react';
import MobileNavbar from './MobileNavbar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showNavbar?: boolean;
}

const Layout = ({ 
  children, 
  title, 
  showBackButton = false, 
  onBackClick, 
  showNavbar = true 
}: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        title={title} 
        showBackButton={showBackButton} 
        onBackClick={onBackClick} 
      />
      
      <main className="flex-1 pb-16">
        <div className="nexentry-container py-4">
          {children}
        </div>
      </main>
      
      {showNavbar && <MobileNavbar />}
    </div>
  );
};

export default Layout;
