
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ArrowUpRight } from "lucide-react";

const HomeNavbar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent">
          nexentry
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Fonctionnalités</a>
          <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Comment ça marche</a>
          <a href="#pricing" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Tarifs</a>
          <Link 
            to="/login"
            className="px-4 py-2 text-blue-600 border border-transparent hover:border-blue-600 rounded-full text-sm font-medium transition-all"
          >
            Essayer
          </Link>
        </div>
        
        <div className="flex md:hidden items-center space-x-4">
          <Link 
            to="/login"
            className="px-3 py-1.5 text-blue-600 border border-blue-600 rounded-full text-sm font-medium flex items-center"
          >
            <span>Essayer</span>
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="text-gray-700">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="pt-12">
              <div className="flex flex-col space-y-4">
                <a 
                  href="#features" 
                  className="text-gray-700 hover:text-blue-600 text-base font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Fonctionnalités
                </a>
                <a 
                  href="#how-it-works" 
                  className="text-gray-700 hover:text-blue-600 text-base font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Comment ça marche
                </a>
                <a 
                  href="#pricing" 
                  className="text-gray-700 hover:text-blue-600 text-base font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Tarifs
                </a>
                <Link 
                  to="/login"
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-full text-base font-medium transition-all inline-flex items-center justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Essayer maintenant</span>
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
