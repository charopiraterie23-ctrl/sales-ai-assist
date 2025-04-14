
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  badge?: string;
  highlight?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  title,
  price,
  description,
  features,
  buttonText,
  buttonLink,
  badge,
  highlight = false
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

export default PricingCard;
