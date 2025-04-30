
import { Activity } from './ActivityFeed';

// Sample activities for development
export const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Appel avec Jean Dupont',
    excerpt: 'Discussion sur le projet de refonte du site web. Prochaine étape: valider la maquette.',
    tags: [{ name: 'urgent', color: 'red' }, { name: 'web', color: 'blue' }],
    status: 'new' as 'new' | 'sent' | 'archived'
  },
  {
    id: '2',
    title: 'Réunion équipe marketing',
    excerpt: 'Planification de la campagne Q2. Budget validé à 15k$.',
    tags: [{ name: 'marketing', color: 'green' }],
    status: 'sent' as 'new' | 'sent' | 'archived'
  },
  {
    id: '3',
    title: 'Appel de suivi Sophie Martin',
    excerpt: "Intérêt pour l'offre premium. Relancer dans 2 semaines.",
    tags: [{ name: 'lead', color: 'purple' }],
    status: 'new' as 'new' | 'sent' | 'archived'
  },
  {
    id: '4',
    title: 'Point hebdo Jacques',
    excerpt: 'Revue des KPIs et ajustement des objectifs du trimestre.',
    tags: [{ name: 'interne', color: 'gray' }],
    status: 'archived' as 'new' | 'sent' | 'archived'
  },
  {
    id: '5',
    title: 'Consultation Entreprise ABC',
    excerpt: 'Besoin identifié: solution de gestion de projet. Budget ~5k$/mois.',
    tags: [{ name: 'opportunité', color: 'amber' }],
    status: 'sent' as 'new' | 'sent' | 'archived'
  }
];
