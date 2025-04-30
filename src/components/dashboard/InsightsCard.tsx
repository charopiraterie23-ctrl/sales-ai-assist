
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface InsightData {
  name: string;
  value: number;
}

const InsightsCard: React.FC = () => {
  // Données factices pour les sparklines
  const timeData: InsightData[] = Array(30).fill(0).map((_, i) => ({
    name: `Day ${i + 1}`,
    value: 10 + Math.random() * 15
  }));
  
  const rateData: InsightData[] = Array(30).fill(0).map((_, i) => ({
    name: `Day ${i + 1}`,
    value: 30 + Math.random() * 40
  }));
  
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <h3 className="font-semibold mb-3">Insights</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Heures gagnées</div>
            <div className="text-xl font-bold">24h</div>
            <div className="h-[50px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeData}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2166F0" 
                    strokeWidth={1.5} 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Taux de relance</div>
            <div className="text-xl font-bold">53%</div>
            <div className="h-[50px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rateData}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2166F0" 
                    strokeWidth={1.5} 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsCard;
