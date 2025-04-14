
import React from 'react';
import { SettingsIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PreferencesSectionProps {
  aiTone: string;
  setAITone: (value: string) => void;
  emailLanguage: string;
  setEmailLanguage: (value: string) => void;
  summaryStructure: string;
  setSummaryStructure: (value: string) => void;
}

const PreferencesSection = ({
  aiTone,
  setAITone,
  emailLanguage,
  setEmailLanguage,
  summaryStructure,
  setSummaryStructure
}: PreferencesSectionProps) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <SettingsIcon className="mr-2" /> Préférences IA
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Ton des emails</label>
          <Select value={aiTone} onValueChange={setAITone}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un ton" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professionnel</SelectItem>
              <SelectItem value="friendly">Détendu / Amical</SelectItem>
              <SelectItem value="neutral">Neutre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-2">Langue des emails</label>
          <Select value={emailLanguage} onValueChange={setEmailLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une langue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="french">Français</SelectItem>
              <SelectItem value="english">Anglais</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-2">Structure des résumés</label>
          <Select value={summaryStructure} onValueChange={setSummaryStructure}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une structure" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="points">Résumé par points</SelectItem>
              <SelectItem value="short">Résumé court</SelectItem>
              <SelectItem value="detailed">Résumé détaillé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSection;
