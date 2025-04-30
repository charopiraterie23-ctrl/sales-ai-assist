
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface Activity {
  id: string;
  title: string;
  excerpt: string;
  tags: { name: string; color: string }[];
  status: 'new' | 'sent' | 'archived';
}

const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Appel avec Jean Dupont',
    excerpt: 'Discussion sur le projet de refonte du site web. Prochaine étape: valider la maquette.',
    tags: [{ name: 'urgent', color: 'red' }, { name: 'web', color: 'blue' }],
    status: 'new'
  },
  {
    id: '2',
    title: 'Réunion équipe marketing',
    excerpt: 'Planification de la campagne Q2. Budget validé à 15k$.',
    tags: [{ name: 'marketing', color: 'green' }],
    status: 'sent'
  },
  {
    id: '3',
    title: 'Appel de suivi Sophie Martin',
    excerpt: 'Intérêt pour l'offre premium. Relancer dans 2 semaines.',
    tags: [{ name: 'lead', color: 'purple' }],
    status: 'new'
  },
  {
    id: '4',
    title: 'Point hebdo Jacques',
    excerpt: 'Revue des KPIs et ajustement des objectifs du trimestre.',
    tags: [{ name: 'interne', color: 'gray' }],
    status: 'archived'
  },
  {
    id: '5',
    title: 'Consultation Entreprise ABC',
    excerpt: 'Besoin identifié: solution de gestion de projet. Budget ~5k$/mois.',
    tags: [{ name: 'opportunité', color: 'amber' }],
    status: 'sent'
  }
];

const ActivityFeed: React.FC = () => {
  // Function to get status color
  const getStatusColor = (status: Activity['status']): string => {
    switch(status) {
      case 'new': return 'bg-blue-500';
      case 'sent': return 'bg-green-500';
      case 'archived': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-800">
      {mockActivities.map((activity) => (
        <div key={activity.id} className="p-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className={`w-1 self-stretch rounded-full ${getStatusColor(activity.status)}`}></div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{activity.title}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1 mb-2">{activity.excerpt}</p>
            
            <div className="flex flex-wrap gap-1.5 mt-1">
              {activity.tags.map((tag, idx) => (
                <Badge 
                  key={`${activity.id}-${idx}`} 
                  variant="outline"
                  className={`text-xs py-0 h-5 bg-${tag.color}-100 text-${tag.color}-800 border-${tag.color}-200`}
                >
                  #{tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
