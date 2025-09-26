import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Phone, Mail, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface AnalyticsData {
  totalClients: number;
  totalCalls: number;
  totalEmails: number;
  totalSMS: number;
  clientsByStatus: Record<string, number>;
  monthlyGrowth: number;
  conversionRate: number;
}

const BasicAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      // Get client statistics
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('status, created_at')
        .eq('user_id', user?.id);

      if (clientsError) throw clientsError;

      // Get call statistics
      const { data: calls, error: callsError } = await supabase
        .from('calls')
        .select('created_at')
        .eq('user_id', user?.id);

      if (callsError) throw callsError;

      // Get email statistics (if followup_emails table exists)
      const { data: emails } = await supabase
        .from('followup_emails')
        .select('id')
        .limit(1000);

      // Calculate analytics
      const totalClients = clients?.length || 0;
      const totalCalls = calls?.length || 0;
      const totalEmails = emails?.length || 0;

      // Client status breakdown
      const clientsByStatus = clients?.reduce((acc, client) => {
        const status = client.status || 'lead';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Monthly growth calculation
      const thisMonth = new Date();
      thisMonth.setDate(1);
      
      const newClientsThisMonth = clients?.filter(client => 
        new Date(client.created_at) >= thisMonth
      ).length || 0;

      const monthlyGrowth = totalClients > 0 ? (newClientsThisMonth / totalClients) * 100 : 0;

      // Conversion rate (conclu / total)
      const concludedClients = clientsByStatus['conclu'] || 0;
      const conversionRate = totalClients > 0 ? (concludedClients / totalClients) * 100 : 0;

      setAnalytics({
        totalClients,
        totalCalls,
        totalEmails,
        totalSMS: 0, // Will be populated when SMS logs are implemented
        clientsByStatus,
        monthlyGrowth,
        conversionRate
      });

    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  const statusLabels = {
    'lead': 'Prospects',
    'intéressé': 'Intéressés',
    'en attente': 'En attente',
    'conclu': 'Conclus',
    'perdu': 'Perdus'
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              +{analytics.monthlyGrowth.toFixed(1)}% ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appels Enregistrés</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCalls}</div>
            <p className="text-xs text-muted-foreground">
              Avec transcription IA
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Envoyés</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalEmails}</div>
            <p className="text-xs text-muted-foreground">
              Follow-ups automatiques
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Prospects → Conclus
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Client Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analytics.clientsByStatus).map(([status, count]) => {
              const percentage = analytics.totalClients > 0 ? (count / analytics.totalClients) * 100 : 0;
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {statusLabels[status as keyof typeof statusLabels] || status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {count} clients
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicAnalytics;