
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Mail, Phone, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';

const DailyActionsPage = () => {
  const { user } = useAuth();
  const dashboardData = useDashboardData(user?.id);
  const [selectedTab, setSelectedTab] = useState('all');
  
  // Sample data for demonstration - in a real app, this would come from API
  const callActions = dashboardData.callsToFollow?.calls.map(call => ({
    id: call.id,
    title: `Appel client à suivre`,
    date: new Date(call.created_at).toLocaleDateString('fr-FR'),
    completed: false,
    type: 'call' as const,
    clientId: call.client_id
  })) || [];
  
  const emailActions = dashboardData.emailsToSend?.emails.map(email => ({
    id: email.id,
    title: `Email à envoyer: ${email.subject}`,
    to: email.to,
    completed: false,
    type: 'email' as const,
    summaryId: email.summary_id
  })) || [];
  
  // Combine all actions
  const allActions = [...callActions, ...emailActions];
  
  // Filtered actions based on selected tab
  const getFilteredActions = () => {
    switch (selectedTab) {
      case 'calls':
        return callActions;
      case 'emails':
        return emailActions;
      default:
        return allActions;
    }
  };
  
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };
  
  const toggleActionComplete = (id: string) => {
    // In a real app, this would update the state and likely make an API call
    console.log('Toggling action:', id);
  };

  return (
    <Layout 
      title="Mes actions du jour" 
      showBackButton={true}
      onBackClick={() => window.history.back()}
    >
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Actions du <CalendarDays className="inline h-6 w-6 ml-1" /></h1>
          <Button variant="outline" size="sm" onClick={() => dashboardData.refetch()}>
            Actualiser
          </Button>
        </div>
        
        <Tabs defaultValue="all" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Toutes ({allActions.length})</TabsTrigger>
            <TabsTrigger value="calls">Appels ({callActions.length})</TabsTrigger>
            <TabsTrigger value="emails">Emails ({emailActions.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <ActionsList actions={getFilteredActions()} onToggle={toggleActionComplete} />
          </TabsContent>
          
          <TabsContent value="calls" className="mt-4">
            <ActionsList actions={getFilteredActions()} onToggle={toggleActionComplete} />
          </TabsContent>
          
          <TabsContent value="emails" className="mt-4">
            <ActionsList actions={getFilteredActions()} onToggle={toggleActionComplete} />
          </TabsContent>
        </Tabs>
        
        {getFilteredActions().length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-center text-gray-500 my-4">
                Aucune action à afficher pour aujourd'hui.
              </p>
              <Button onClick={() => dashboardData.refetch()}>
                Actualiser
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

// Separate component for the actions list
interface Action {
  id: string;
  title: string;
  completed: boolean;
  type: 'call' | 'email' | 'client';
  date?: string;
  to?: string;
  clientId?: string;
  summaryId?: string;
}

interface ActionsListProps {
  actions: Action[];
  onToggle: (id: string) => void;
}

const ActionsList = ({ actions, onToggle }: ActionsListProps) => {
  return (
    <div className="space-y-3">
      {actions.map((action) => (
        <Card key={action.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-start p-4">
              <div className="mr-2 pt-1">
                <Checkbox
                  id={`action-${action.id}`}
                  checked={action.completed}
                  onCheckedChange={() => onToggle(action.id)}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <label 
                    htmlFor={`action-${action.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                  >
                    {action.title}
                  </label>
                  {action.type === 'call' && <Phone className="h-4 w-4 text-gray-400" />}
                  {action.type === 'email' && <Mail className="h-4 w-4 text-gray-400" />}
                  {action.type === 'client' && <Users className="h-4 w-4 text-gray-400" />}
                </div>
                {action.date && (
                  <p className="text-xs text-gray-500 mt-1">
                    Date: {action.date}
                  </p>
                )}
                {action.to && (
                  <p className="text-xs text-gray-500 mt-1">
                    Destinataire: {action.to}
                  </p>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-2">
              <div className="flex justify-end space-x-2">
                {action.type === 'call' && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/client/${action.clientId}`}>
                      <Users className="mr-1 h-4 w-4" /> Voir client
                    </a>
                  </Button>
                )}
                {action.type === 'email' && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/call-summary/${action.summaryId}`}>
                      <Mail className="mr-1 h-4 w-4" /> Voir email
                    </a>
                  </Button>
                )}
                <Button size="sm">
                  {action.type === 'call' ? 'Marquer comme traité' : 'Envoyer'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DailyActionsPage;
