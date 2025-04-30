
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
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <User className="mr-2" /> Profil personnel
        </h2>
        <Button
          onClick={handleEditToggle}
          variant={isEditing ? "default" : "outline"}
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
            <Avatar className={`h-16 w-16 ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}>
              <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name} />
              <AvatarFallback>{initials}</AvatarFallback>
              {isEditing && (
                <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
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
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>
            ) : (
              <>
                <p className="font-medium">{profile.full_name}</p>
                <p className="text-sm text-gray-500">{profile.email}</p>
                {profile.phone_number && (
                  <p className="text-sm text-gray-500">{profile.phone_number}</p>
                )}
              </>
            )}
          </div>
        </div>
        
        <div>
          <Label className="text-sm text-gray-500">Type de compte</Label>
          <p className="text-sm font-medium">
            {profile.plan === 'pro' ? 'Pro' : 'Gratuit'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
