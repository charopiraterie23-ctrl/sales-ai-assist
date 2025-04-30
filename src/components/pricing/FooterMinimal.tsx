
import React from "react";
import { Link } from "react-router-dom";

const FooterMinimal: React.FC = () => {
  return (
    <footer className="bg-[#F4F6F8] py-8 px-4 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-lg font-semibold text-[#2166F0]">
              nexentry
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              Simplifiez vos ventes grâce à l'IA
            </p>
          </div>
          
          <div className="flex space-x-8">
            <div className="text-sm">
              <h3 className="font-medium text-gray-900 mb-2">Produit</h3>
              <ul className="space-y-2">
                <li><Link to="/pricing" className="text-gray-600 hover:text-[#2166F0]">Tarifs</Link></li>
                <li><Link to="/#features" className="text-gray-600 hover:text-[#2166F0]">Fonctionnalités</Link></li>
              </ul>
            </div>
            
            <div className="text-sm">
              <h3 className="font-medium text-gray-900 mb-2">Légal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-600 hover:text-[#2166F0]">Confidentialité</Link></li>
                <li><Link to="/terms" className="text-gray-600 hover:text-[#2166F0]">CGU</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} nexentry. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default FooterMinimal;
