
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import DashboardWelcomeHeader from '@/components/dashboard/DashboardWelcomeHeader';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import FreeDashboardContent from '@/components/dashboard/FreeDashboardContent';
import ProDashboardContent from '@/components/dashboard/ProDashboardContent';

const DashboardPage = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [tipIndex, setTipIndex] = useState(0);
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const [hasRecentCall, setHasRecentCall] = useState(false);
  
  // Explicitly ensure that we're properly checking the plan
  const userPlan = profile?.plan?.toLowerCase() || 'free';

  useEffect(() => {
    // For debugging purposes
    console.log("Current user profile:", profile);
    console.log("User plan detected:", userPlan);
    
    // Rotate tips every 10 seconds
    const interval = setInterval(() => {
      setTipIndex((prev) => {
        const tipsLength = userPlan === 'pro' ? 4 : 4; // Could be dynamic based on tips arrays length
        return (prev + 1) % tipsLength;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [userPlan, profile]);

  // Sample data - in real app, would be fetched from Supabase
  const callsUsed = userPlan === 'pro' ? 34 : 2;
  const callsTotal = userPlan === 'pro' ? 100 : 3;
  const usagePercentage = (callsUsed / callsTotal) * 100;
  
  if (isLoading) {
    return (
      <Layout title="Dashboard" showNavbar={true}>
        <DashboardLoading />
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard" showNavbar={true}>
      <div className="space-y-6 pb-6">
        {/* Welcome Header - Common for all plans */}
        <DashboardWelcomeHeader 
          fullName={profile?.full_name} 
          userPlan={userPlan} 
        />

        {/* Render based on plan */}
        {userPlan === 'pro' ? (
          <ProDashboardContent 
            navigate={navigate}
            tipIndex={tipIndex}
            callsUsed={callsUsed}
            callsTotal={callsTotal}
            usagePercentage={usagePercentage}
          />
        ) : (
          <FreeDashboardContent 
            isFirstLogin={isFirstLogin} 
            hasRecentCall={hasRecentCall}
            navigate={navigate}
            tipIndex={tipIndex}
            callsUsed={callsUsed}
            callsTotal={callsTotal}
            usagePercentage={usagePercentage}
          />
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
