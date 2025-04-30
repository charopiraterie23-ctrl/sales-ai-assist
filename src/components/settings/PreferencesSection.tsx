
import React from 'react';
import { Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
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
    <div className="bg-gray-950/30 backdrop-blur-md border border-gray-800/40 rounded-xl p-6 text-white">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <SettingsIcon className="mr-2 text-gray-400" /> Préférences IA
      </h2>
      <div className="space-y-5">
        <div>
          <label className="block mb-2 text-gray-300">Ton des emails</label>
          <Select value={aiTone} onValueChange={setAITone}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Sélectionner un ton" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="professional">Professionnel</SelectItem>
              <SelectItem value="friendly">Détendu / Amical</SelectItem>
              <SelectItem value="neutral">Neutre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-2 text-gray-300">Langue des emails</label>
          <Select value={emailLanguage} onValueChange={setEmailLanguage}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Sélectionner une langue" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="french">Français</SelectItem>
              <SelectItem value="english">Anglais</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-2 text-gray-300">Structure des résumés</label>
          <Select value={summaryStructure} onValueChange={setSummaryStructure}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Sélectionner une structure" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="points">Résumé par points</SelectItem>
              <SelectItem value="short">Résumé court</SelectItem>
              <SelectItem value="detailed">Résumé détaillé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-gray-400" />
            <Label htmlFor="dark-mode" className="text-gray-300">Mode sombre</Label>
            <Moon className="h-4 w-4 text-gray-400" />
          </div>
          <Switch
            id="dark-mode"
            checked={theme === 'dark'}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            className="data-[state=checked]:bg-nexentry-blue"
          />
        </div>
      </div>
    </div>
  );
};

export default PreferencesSection;
