
import React from 'react';
import { SettingsIcon, Moon, Sun } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/context/ThemeContext';

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
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
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
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <Label htmlFor="dark-mode">Mode sombre</Label>
            <Moon className="h-4 w-4" />
          </div>
          <Switch
            id="dark-mode"
            checked={theme === 'dark'}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </div>
      </div>
    </div>
  );
};

export default PreferencesSection;
