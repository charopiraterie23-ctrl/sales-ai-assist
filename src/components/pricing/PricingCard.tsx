
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  onClick: () => void;
  badge?: string;
  highlight?: boolean;
  isLoading?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  title,
  price,
  description,
  features,
  buttonText,
  onClick,
  badge,
  highlight = false,
  isLoading = false
}) => (
  <Card className={`overflow-hidden ${highlight ? 'border-[#2166F0] shadow-md' : 'border-gray-200 shadow-sm'}`}>
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {badge && (
          <Badge className="bg-[#2166F0] hover:bg-blue-700 text-white">
            {badge}
          </Badge>
        )}
      </div>
      
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-gray-500 text-sm ml-1">{description}</span>
      </div>
      
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-[#2166F0] shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        className={`w-full rounded-lg ${highlight 
          ? 'bg-[#2166F0] hover:bg-blue-700 text-white' 
          : 'bg-white text-[#2166F0] border border-[#2166F0] hover:bg-[#F4F6F8]'}`}
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? 'Chargement...' : buttonText}
      </Button>
    </div>
  </Card>
);

export default PricingCard;
