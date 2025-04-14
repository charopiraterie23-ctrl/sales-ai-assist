
import React from "react";
import { Link } from "react-router-dom";

const HomeNavbar = () => {
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
        
        <button className="md:hidden text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default HomeNavbar;
