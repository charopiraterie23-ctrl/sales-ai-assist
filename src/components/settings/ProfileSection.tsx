
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Check, Loader2, User } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ProfileSectionProps {
  profile: any;
  isEditing: boolean;
  isLoading: boolean;
  formData: {
    fullName: string;
    phoneNumber: string;
  };
  handleEditToggle: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAvatarClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileSection = ({
  profile,
  isEditing,
  isLoading,
  formData,
  handleEditToggle,
  handleInputChange,
  handleAvatarClick,
  fileInputRef,
  handleFileChange
}: ProfileSectionProps) => {
  const initials = profile.full_name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="bg-gray-950/30 backdrop-blur-md border border-gray-800/40 rounded-xl p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Profil personnel</h2>
        <Button
          onClick={handleEditToggle}
          variant="outline"
          className={`${isEditing ? 'bg-nexentry-blue text-white' : 'bg-gray-900 text-white border-gray-700'}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isEditing ? (
            <Check className="mr-2 h-4 w-4" />
          ) : null}
          {isEditing ? "Enregistrer" : "Modifier"}
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative" onClick={isEditing ? handleAvatarClick : undefined}>
            <Avatar className={`h-16 w-16 bg-gray-800 border-2 border-nexentry-blue ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}>
              <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name} />
              <AvatarFallback className="bg-gray-800 text-white">{initials}</AvatarFallback>
              {isEditing && (
                <div className="absolute bottom-0 right-0 bg-nexentry-blue rounded-full p-1">
                  <Camera className="h-3 w-3 text-white" />
                </div>
              )}
            </Avatar>
            {isEditing && (
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            )}
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <div>
                  <Label htmlFor="fullName" className="text-gray-300">Nom complet</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber" className="text-gray-300">Numéro de téléphone</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+33 6 12 34 56 78"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            ) : (
              <>
                <p className="font-medium text-white">{profile.full_name}</p>
                <p className="text-sm text-gray-400">{profile.email}</p>
                {profile.phone_number && (
                  <p className="text-sm text-gray-400">{profile.phone_number}</p>
                )}
              </>
            )}
          </div>
        </div>
        
        <div>
          <Label className="text-sm text-gray-400">Type de compte</Label>
          <p className="text-sm font-medium text-white">
            {profile.plan === 'pro' ? 'Pro' : 'Gratuit'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
