
import { Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TipCardProps {
  tip: string;
  isPro?: boolean;
}

const TipCard = ({ tip, isPro = false }: TipCardProps) => {
  return (
    <Card className="bg-nexentry-blue-light/10 border-nexentry-blue-light animate-slide-up">
      <CardContent className="py-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 bg-nexentry-blue-light/20 rounded-full p-2 h-fit">
            {isPro ? (
              <Zap className="h-5 w-5 text-nexentry-blue" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-nexentry-blue"
              >
                <path d="M12 2a7 7 0 0 1 7 7c0 2.1-.7 3.3-2 4.8L12 19l-5-5.2C5.7 12.3 5 11.1 5 9a7 7 0 0 1 7-7Z" />
                <path d="M12 6v2" />
                <path d="M12 11h.01" />
              </svg>
            )}
          </div>
          <div>
            <h4 className="font-medium text-sm mb-1">{isPro ? "Astuce Pro" : "Astuce nexentry"}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {tip}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TipCard;
