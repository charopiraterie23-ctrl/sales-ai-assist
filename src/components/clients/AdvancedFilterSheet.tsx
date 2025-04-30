
import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ClientStatus } from '@/types/client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface FilterOptions {
  status: ClientStatus | 'all';
  lastContactedDays: number | null;
  lastContactedCustomRange: {
    from: Date | undefined;
    to: Date | undefined;
  } | null;
  hasEmail: boolean | null;
  hasPhone: boolean | null;
}

interface AdvancedFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
}

const AdvancedFilterSheet = ({
  open,
  onOpenChange,
  filters,
  onApplyFilters
}: AdvancedFilterSheetProps) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [activeTab, setActiveTab] = useState('statut');

  const handleStatusChange = (status: ClientStatus | 'all') => {
    setLocalFilters(prev => ({ ...prev, status }));
  };

  const handleLastContactedDaysChange = (days: number | null) => {
    setLocalFilters(prev => ({ 
      ...prev, 
      lastContactedDays: days,
      lastContactedCustomRange: null 
    }));
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setLocalFilters(prev => ({ 
      ...prev, 
      lastContactedCustomRange: range,
      lastContactedDays: null
    }));
  };

  const handleContactInfoChange = (key: 'hasEmail' | 'hasPhone', value: boolean | null) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setLocalFilters({
      status: 'all',
      lastContactedDays: null,
      lastContactedCustomRange: null,
      hasEmail: null,
      hasPhone: null
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const isFilterActive = 
    localFilters.status !== 'all' ||
    localFilters.lastContactedDays !== null ||
    localFilters.lastContactedCustomRange !== null ||
    localFilters.hasEmail !== null ||
    localFilters.hasPhone !== null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] px-0">
        <SheetHeader className="px-4 mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle>Filtres avancés</SheetTitle>
            <Button variant="ghost" size="icon" onClick={handleResetFilters} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription>
            Filtrez vos clients selon différents critères
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="statut">Statut</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="statut" className="px-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Statut du client</h3>
              <RadioGroup 
                value={localFilters.status} 
                onValueChange={handleStatusChange as (value: string) => void}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">Tous</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lead" id="lead" />
                  <Label htmlFor="lead">Lead</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intéressé" id="interesse" />
                  <Label htmlFor="interesse">Intéressé</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en attente" id="en-attente" />
                  <Label htmlFor="en-attente">En attente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conclu" id="conclu" />
                  <Label htmlFor="conclu">Conclu</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="perdu" id="perdu" />
                  <Label htmlFor="perdu">Perdu</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
          
          <TabsContent value="contact" className="px-4">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Dernier contact</h3>
                <ToggleGroup 
                  type="single" 
                  className="flex flex-wrap gap-2"
                  value={localFilters.lastContactedDays?.toString() || ""}
                  onValueChange={(value) => handleLastContactedDaysChange(value ? Number(value) : null)}
                >
                  <ToggleGroupItem value="7" className="rounded-full">7 jours</ToggleGroupItem>
                  <ToggleGroupItem value="30" className="rounded-full">30 jours</ToggleGroupItem>
                  <ToggleGroupItem value="90" className="rounded-full">3 mois</ToggleGroupItem>
                </ToggleGroup>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={localFilters.lastContactedCustomRange ? "bg-primary text-primary-foreground" : ""}
                    >
                      {localFilters.lastContactedCustomRange ? 
                        `${format(localFilters.lastContactedCustomRange.from || new Date(), 'P', {locale: fr})} - ${format(localFilters.lastContactedCustomRange.to || new Date(), 'P', {locale: fr})}` : 
                        "Date personnalisée"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="range"
                      selected={localFilters.lastContactedCustomRange || undefined}
                      onSelect={handleDateRangeChange}
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Mode de contact</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={localFilters.hasEmail === true ? "default" : "outline"} 
                    onClick={() => handleContactInfoChange('hasEmail', localFilters.hasEmail === true ? null : true)}
                    className="justify-start"
                  >
                    {localFilters.hasEmail === true && <Check className="h-4 w-4 mr-2" />}
                    Avec email
                  </Button>
                  <Button 
                    variant={localFilters.hasEmail === false ? "default" : "outline"} 
                    onClick={() => handleContactInfoChange('hasEmail', localFilters.hasEmail === false ? null : false)}
                    className="justify-start"
                  >
                    {localFilters.hasEmail === false && <Check className="h-4 w-4 mr-2" />}
                    Sans email
                  </Button>
                  <Button 
                    variant={localFilters.hasPhone === true ? "default" : "outline"} 
                    onClick={() => handleContactInfoChange('hasPhone', localFilters.hasPhone === true ? null : true)}
                    className="justify-start"
                  >
                    {localFilters.hasPhone === true && <Check className="h-4 w-4 mr-2" />}
                    Avec téléphone
                  </Button>
                  <Button 
                    variant={localFilters.hasPhone === false ? "default" : "outline"} 
                    onClick={() => handleContactInfoChange('hasPhone', localFilters.hasPhone === false ? null : false)}
                    className="justify-start"
                  >
                    {localFilters.hasPhone === false && <Check className="h-4 w-4 mr-2" />}
                    Sans téléphone
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="px-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Informations complémentaires</h3>
              <p className="text-sm text-muted-foreground">
                Options supplémentaires à venir...
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <SheetFooter className="px-4 absolute bottom-0 left-0 right-0 pb-6 bg-background border-t">
          <Button 
            onClick={handleApply}
            className="w-full"
            disabled={!isFilterActive}
          >
            Appliquer les filtres
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AdvancedFilterSheet;
