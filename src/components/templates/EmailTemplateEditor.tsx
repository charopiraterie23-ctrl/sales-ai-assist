import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Eye, Save, Copy, Variables } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
  is_default: boolean;
}

const EmailTemplateEditor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewData, setPreviewData] = useState({
    client_name: 'Sophie Martin',
    company: 'TechCorp Solutions',
    sender_name: 'Jean Dupont',
    follow_up_date: 'vendredi prochain'
  });

  useEffect(() => {
    if (user) {
      loadTemplates();
    }
  }, [user]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
      
      if (data && data.length > 0) {
        setSelectedTemplate(data[0]);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les templates",
        variant: "destructive"
      });
    }
  };

  const saveTemplate = async () => {
    if (!selectedTemplate || !user) return;

    try {
      const { error } = await supabase
        .from('templates')
        .upsert({
          ...selectedTemplate,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Template sauvegardé",
        description: "Le template a été enregistré avec succès",
      });

      setIsEditing(false);
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le template",
        variant: "destructive"
      });
    }
  };

  const createNewTemplate = () => {
    const newTemplate: Template = {
      id: '',
      name: 'Nouveau template',
      type: 'email',
      subject: '',
      content: '',
      variables: [],
      is_default: false
    };
    setSelectedTemplate(newTemplate);
    setIsEditing(true);
  };

  const duplicateTemplate = () => {
    if (!selectedTemplate) return;
    
    const duplicated: Template = {
      ...selectedTemplate,
      id: '',
      name: `${selectedTemplate.name} (copie)`,
      is_default: false
    };
    setSelectedTemplate(duplicated);
    setIsEditing(true);
  };

  const extractVariables = (content: string) => {
    const regex = /\{\{(\w+)\}\}/g;
    const variables = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    return variables;
  };

  const renderPreview = (content: string) => {
    let preview = content;
    Object.entries(previewData).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      preview = preview.replace(regex, value);
    });
    return preview;
  };

  const predefinedTemplates = [
    {
      name: "Suivi découverte",
      subject: "Suite à notre échange - {{client_name}}",
      content: `Bonjour {{client_name}},

Merci pour le temps accordé lors de notre échange d'aujourd'hui concernant les besoins de {{company}}.

Pour résumer notre discussion :
• Vous cherchez à améliorer votre processus commercial
• L'automatisation des follow-ups est une priorité
• Votre équipe souhaite gagner du temps sur les tâches répétitives

Prochaines étapes :
• Je vous envoie une proposition personnalisée d'ici {{follow_up_date}}
• Nous planifions une démonstration avec votre équipe

N'hésitez pas si vous avez des questions entre temps.

Cordialement,
{{sender_name}}`
    },
    {
      name: "Relance proposition",
      subject: "Votre proposition est prête - {{client_name}}",
      content: `Bonjour {{client_name}},

J'espère que vous allez bien. Je reviens vers vous concernant la proposition que nous avons discutée pour {{company}}.

Comme convenu, vous trouverez en pièce jointe notre offre personnalisée qui inclut :
• Solution adaptée à vos besoins spécifiques
• Tarification préférentielle
• Support dédié pendant la mise en place

Êtes-vous disponible cette semaine pour en discuter ? Je peux me rendre disponible selon vos créneaux.

Dans l'attente de votre retour.

Cordialement,
{{sender_name}}`
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Templates</h1>
          <p className="text-muted-foreground">
            Créez et gérez vos templates d'emails et SMS
          </p>
        </div>
        <Button onClick={createNewTemplate}>
          <Mail className="mr-2 h-4 w-4" />
          Nouveau Template
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Template List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mes Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate?.id === template.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {template.type === 'email' ? 'Email' : 'SMS'}
                      </Badge>
                      {template.is_default && (
                        <Badge variant="secondary" className="text-xs">
                          Par défaut
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {templates.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucun template</p>
                <p className="text-sm">Créez votre premier template</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {isEditing ? 'Édition' : 'Aperçu'} - {selectedTemplate?.name || 'Sélectionnez un template'}
              </CardTitle>
              <div className="flex gap-2">
                {selectedTemplate && !isEditing && (
                  <>
                    <Button variant="outline" size="sm" onClick={duplicateTemplate}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      Éditer
                    </Button>
                  </>
                )}
                {isEditing && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      Annuler
                    </Button>
                    <Button size="sm" onClick={saveTemplate}>
                      <Save className="mr-2 h-4 w-4" />
                      Sauvegarder
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedTemplate ? (
              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit">Édition</TabsTrigger>
                  <TabsTrigger value="preview">Aperçu</TabsTrigger>
                </TabsList>
                
                <TabsContent value="edit" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nom du template</Label>
                      <Input
                        value={selectedTemplate.name}
                        onChange={(e) => setSelectedTemplate({
                          ...selectedTemplate,
                          name: e.target.value
                        })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={selectedTemplate.type}
                        onValueChange={(value) => setSelectedTemplate({
                          ...selectedTemplate,
                          type: value as 'email' | 'sms'
                        })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {selectedTemplate.type === 'email' && (
                    <div>
                      <Label>Objet</Label>
                      <Input
                        value={selectedTemplate.subject || ''}
                        onChange={(e) => setSelectedTemplate({
                          ...selectedTemplate,
                          subject: e.target.value
                        })}
                        disabled={!isEditing}
                        placeholder="Objet de l'email"
                      />
                    </div>
                  )}

                  <div>
                    <Label>Contenu</Label>
                    <Textarea
                      value={selectedTemplate.content}
                      onChange={(e) => {
                        const newContent = e.target.value;
                        const variables = extractVariables(newContent);
                        setSelectedTemplate({
                          ...selectedTemplate,
                          content: newContent,
                          variables
                        });
                      }}
                      disabled={!isEditing}
                      rows={12}
                      placeholder="Contenu du template..."
                    />
                  </div>

                  {selectedTemplate.variables.length > 0 && (
                    <div>
                      <Label className="flex items-center gap-2">
                        <Variables className="h-4 w-4" />
                        Variables détectées
                      </Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedTemplate.variables.map((variable) => (
                          <Badge key={variable} variant="outline">
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="preview" className="space-y-4">
                  {selectedTemplate.type === 'email' && selectedTemplate.subject && (
                    <div>
                      <Label>Objet</Label>
                      <div className="p-3 bg-muted rounded border">
                        {renderPreview(selectedTemplate.subject)}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Label>Contenu</Label>
                    <div className="p-4 bg-muted rounded border whitespace-pre-wrap">
                      {renderPreview(selectedTemplate.content)}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Sélectionnez un template pour commencer</p>
                <p>ou créez-en un nouveau</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Templates */}
      {templates.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Templates prédéfinis</CardTitle>
            <p className="text-sm text-muted-foreground">
              Commencez avec ces templates professionnels
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {predefinedTemplates.map((template, index) => (
                <Card key={index} className="border-dashed">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Objet:</strong> {template.subject}
                      </div>
                      <div className="text-muted-foreground">
                        {template.content.substring(0, 150)}...
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => {
                        const newTemplate: Template = {
                          id: '',
                          name: template.name,
                          type: 'email',
                          subject: template.subject,
                          content: template.content,
                          variables: extractVariables(template.content + template.subject),
                          is_default: false
                        };
                        setSelectedTemplate(newTemplate);
                        setIsEditing(true);
                      }}
                    >
                      Utiliser ce template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailTemplateEditor;