
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEmailConnection } from '@/hooks/email/useEmailConnection';
import { toast } from '@/components/ui/sonner';

// Import component sections
import ProfileSection from '@/components/settings/ProfileSection';
import SecuritySection from '@/components/settings/SecuritySection';
import PreferencesSection from '@/components/settings/PreferencesSection';
import IntegrationsSection from '@/components/settings/IntegrationsSection';
import BillingSection from '@/components/settings/BillingSection';
import SupportSection from '@/components/settings/SupportSection';
import LogoutSection from '@/components/settings/LogoutSection';

const SettingsPage = () => {
  const { user, profile, signOut } = useAuth();
  const { connectEmail, disconnectEmail, connectedAccounts } = useEmailConnection();
  const [aiTone, setAITone] = useState('professional');
  const [emailLanguage, setEmailLanguage] = useState('french');
  const [summaryStructure, setSummaryStructure] = useState('points');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEmailConnect = (provider: 'gmail' | 'outlook') => {
    connectEmail(provider);
  };

  const handleEmailDisconnect = async (provider: 'gmail' | 'outlook') => {
    const result = await disconnectEmail(provider);
    if (result) {
      toast.success(`Compte ${provider === 'gmail' ? 'Gmail' : 'Outlook'} déconnecté`);
    }
    return result;
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setIsLoading(true);
      
      // Simulating an API call
      setTimeout(() => {
        // In a real app, you would call an API to update profile here
        toast.success('Profil mis à jour avec succès');
        setIsLoading(false);
        setIsEditing(false);
      }, 1000);
    } else {
      // Enter edit mode and populate form with current values
      if (profile) {
        setFormData({
          fullName: profile.full_name,
          phoneNumber: profile.phone_number || '',
        });
      }
      setIsEditing(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would upload the file to your storage
      // For this example, we'll just show a success message
      toast.success('Photo de profil mise à jour');
    }
  };

  if (!user || !profile) return null;

  return (
    <Layout title="Paramètres">
      <div className="space-y-8 max-w-2xl mx-auto">
        <ProfileSection 
          profile={profile}
          isEditing={isEditing}
          isLoading={isLoading}
          formData={formData}
          handleEditToggle={handleEditToggle}
          handleInputChange={handleInputChange}
          handleAvatarClick={handleAvatarClick}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
        />
        
        <SecuritySection />
        
        <PreferencesSection 
          aiTone={aiTone}
          setAITone={setAITone}
          emailLanguage={emailLanguage}
          setEmailLanguage={setEmailLanguage}
          summaryStructure={summaryStructure}
          setSummaryStructure={setSummaryStructure}
        />
        
        <IntegrationsSection 
          connectedAccounts={connectedAccounts}
          handleEmailConnect={handleEmailConnect}
          handleEmailDisconnect={handleEmailDisconnect}
        />
        
        <BillingSection />
        
        <SupportSection />
        
        <LogoutSection signOut={signOut} />
      </div>
    </Layout>
  );
};

export default SettingsPage;
