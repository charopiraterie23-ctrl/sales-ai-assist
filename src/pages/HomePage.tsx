import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Mic, Mail, Users, Send, Play, CheckCircle, Award, Users2 } from "lucide-react";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Repenser la façon dont vous <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">vendez.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            nexentry résume vos appels, génère vos relances, et optimise votre temps.
          </p>
          
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 mb-4">
            <Input 
              type="email" 
              placeholder="Votre adresse email pro" 
              className="rounded-full border-gray-300 shadow-sm"
            />
            <Button className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:shadow-lg transition-all">
              Essayer gratuitement
            </Button>
          </div>
          
          <a href="#" className="text-sm text-blue-600 hover:underline">J'ai un code d'invitation</a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Vos tâches répétitives, automatisées.</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">L'IA vous aide là où vous perdez du temps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Mic className="w-10 h-10 text-blue-600" />}
              title="Résumés IA instantanés"
              description="Transcription et résumé de chaque appel en quelques secondes."
            />
            <FeatureCard
              icon={<Mail className="w-10 h-10 text-blue-600" />}
              title="Relances emails personnalisées"
              description="Emails de suivi rédigés par l'IA basés sur la conversation."
            />
            <FeatureCard
              icon={<Users className="w-10 h-10 text-blue-600" />}
              title="Gestion de clients simplifiée"
              description="Organisez tous vos prospects et clients au même endroit."
            />
            <FeatureCard
              icon={<Send className="w-10 h-10 text-blue-600" />}
              title="Envoi direct via Gmail / Outlook"
              description="Intégration avec votre compte email professionnel."
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">3 étapes, et c'est fait.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard
              number="1"
              title="Enregistrez ou uploadez un appel"
              description="Utilisez notre app pour enregistrer un appel ou importez un fichier audio."
            />
            <StepCard
              number="2"
              title="Recevez un résumé et une relance"
              description="Notre IA génère instantanément un résumé et une proposition d'email de suivi."
            />
            <StepCard
              number="3"
              title="Envoyez depuis votre propre email"
              description="Validez, modifiez si besoin, et envoyez directement depuis notre interface."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Des plans adaptés à vos appels</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Testez gratuitement. Passez à Pro quand vous êtes prêt.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="Free"
              price="0$"
              description="Pour tester l'expérience"
              features={[
                "Jusqu'à 3 appels/mois",
                "Résumés uniquement",
                "CRM de base"
              ]}
              buttonText="Commencer gratuitement"
              buttonLink="/register"
              highlight={false}
            />
            <PricingCard
              title="Pro"
              price="19$"
              badge="Le plus populaire"
              description="Pour les professionnels"
              features={[
                "Appels illimités",
                "Emails illimités",
                "Connexion Gmail/Outlook",
                "Support prioritaire",
                "CRM complet"
              ]}
              buttonText="Passer au Pro"
              buttonLink="/register"
              highlight={true}
            />
            <PricingCard
              title="Équipe"
              price="199$"
              description="Pour les équipes"
              features={[
                "Jusqu'à 10 membres",
                "Suivi collaboratif des clients",
                "Envoi d'emails groupés",
                "Support dédié"
              ]}
              buttonText="Contactez-nous"
              buttonLink="/contact"
              highlight={false}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gagnez des heures. Optimisez vos ventes.</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Essayez nexentry.io sans engagement.</p>
          <Button 
            className="rounded-full px-8 py-6 text-base bg-gradient-to-r from-blue-600 to-indigo-500 hover:shadow-lg transition-all"
            asChild
          >
            <Link to="/register">Créer un compte gratuit</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
};

// Helper Components
const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

const StepCard = ({ number, title, description }: {
  number: string;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg mb-4">
      {number}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const PricingCard = ({ 
  title,
  price,
  description,
  features,
  buttonText,
  buttonLink,
  badge,
  highlight
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  badge?: string;
  highlight?: boolean;
}) => (
  <Card className={`border ${highlight ? 'border-blue-500 shadow-md' : 'border-gray-200 shadow-sm'} overflow-hidden`}>
    <div className="p-6">
      {badge && (
        <span className="inline-block mb-4 px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
          {badge}
        </span>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-gray-500">/mois</span>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        className={`w-full rounded-lg ${highlight 
          ? 'bg-gradient-to-r from-blue-600 to-indigo-500' 
          : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'}`}
        asChild
      >
        <Link to={buttonLink}>{buttonText}</Link>
      </Button>
    </div>
  </Card>
);

export default HomePage;
