
import React from "react";

const HomeFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-4">nexentry</h3>
          <p className="text-sm">Simplifiez vos ventes grâce à l'IA.</p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Produit</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#features" className="hover:text-white">Fonctionnalités</a></li>
            <li><a href="#pricing" className="hover:text-white">Tarifs</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Entreprise</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">À propos</a></li>
            <li><a href="#" className="hover:text-white">Nous contacter</a></li>
            <li><a href="#" className="hover:text-white">Carrières</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Légal</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Confidentialité</a></li>
            <li><a href="#" className="hover:text-white">Conditions</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-sm text-center">
        &copy; {new Date().getFullYear()} nexentry. Tous droits réservés.
      </div>
    </footer>
  );
};

export default HomeFooter;
