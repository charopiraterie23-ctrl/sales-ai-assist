
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gagnez des heures. Optimisez vos ventes.</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Résumés instantanés, relances par email et SMS adaptés à votre entreprise. Essayez nexentry sans engagement.
        </p>
        <Button 
          className="rounded-full px-8 py-6 text-base bg-gradient-to-r from-blue-600 to-indigo-500 hover:shadow-lg transition-all"
          asChild
        >
          <Link to="/login">Commencer l'essai gratuit</Link>
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
