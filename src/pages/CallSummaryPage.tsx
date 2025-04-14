
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, Edit, Copy, SendHorizontal, User, Building, Tag } from 'lucide-react';
import { formatDuration, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { AnalysisResult } from '@/api/aiApi';

const CallSummaryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("resume");
  const [isEditing, setIsEditing] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [analysisLoaded, setAnalysisLoaded] = useState(false);

  // Chargement des données d'analyse depuis localStorage pour démo
  // Dans un cas réel, vous les chargeriez depuis la base de données
  useEffect(() => {
    if (id === 'new') {
      const savedAnalysis = localStorage.getItem('callAnalysis');
      if (savedAnalysis) {
        try {
          const analysis = JSON.parse(savedAnalysis) as AnalysisResult;
          setSummaryText(analysis.summary);
          setKeyPoints(analysis.key_points);
          setTags(analysis.tags);
          setEmailSubject(analysis.follow_up_email.subject);
          setEmailBody(analysis.follow_up_email.body);
          setAnalysisLoaded(true);
        } catch (error) {
          console.error('Erreur lors du chargement de l\'analyse:', error);
          toast.error('Erreur lors du chargement de l\'analyse');
        }
      }
    }
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSaveSummary = () => {
    setIsEditing(false);
    toast.success("Résumé enregistré");
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(summaryText);
    toast.success("Résumé copié dans le presse-papier");
  };

  const handleSendEmail = () => {
    toast.success("Email envoyé avec succès");
    navigate("/calls");
  };

  // Mock data for the call
  const callData = {
    date: new Date(2023, 3, 15, 14, 30),
    duration: 840, // 14 minutes
    clientName: id === 'new' ? "Jean Dupont" : "Jean Dupont",
    company: id === 'new' ? "ABC Technologies" : "ABC Technologies",
    tags: tags.length > 0 ? tags : ["prix", "besoins", "timing"]
  };

  return (
    <Layout 
      title="Résumé d'appel" 
      showBackButton={true}
      onBackClick={handleGoBack}
    >
      <div className="space-y-6">
        <div className="nexentry-card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">{callData.clientName}</h2>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
                <Building size={14} className="mr-1" />
                {callData.company}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/client/1')}
              className="flex items-center gap-1 text-xs"
            >
              <User size={14} />
              Voir client
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              {formatDistanceToNow(callData.date, { addSuffix: true, locale: fr })}
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              {formatDuration(
                { minutes: Math.floor(callData.duration / 60), seconds: callData.duration % 60 },
                { locale: fr }
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {callData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs flex items-center gap-1">
                <Tag size={10} />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resume">Résumé</TabsTrigger>
            <TabsTrigger value="points">Points clés</TabsTrigger>
            <TabsTrigger value="email">Email de suivi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resume" className="pt-4">
            <div className="nexentry-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Résumé de l'appel</h3>
                <div className="flex gap-2">
                  {isEditing ? (
                    <Button size="sm" onClick={handleSaveSummary}>
                      Enregistrer
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-500"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-500"
                        onClick={handleCopySummary}
                      >
                        <Copy size={16} />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              {isEditing ? (
                <Textarea 
                  value={summaryText} 
                  onChange={(e) => setSummaryText(e.target.value)}
                  className="min-h-[150px]"
                />
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <p>{summaryText || "Le client a exprimé un intérêt marqué pour notre solution Premium. Points clés abordés : budget de 5000€, besoin de flexibilité sur les délais de livraison, et interrogations sur le service après-vente. Nous avons convenu d'une démo le 20 avril avec leur équipe technique."}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="points" className="pt-4">
            <div className="nexentry-card">
              <h3 className="font-medium mb-4">Points clés de la conversation</h3>
              
              <ul className="space-y-3">
                {keyPoints.length > 0 ? (
                  keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-nexentry-blue/10 flex items-center justify-center text-nexentry-blue mr-2 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{point}</p>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-nexentry-blue/10 flex items-center justify-center text-nexentry-blue mr-2 mt-0.5">
                        1
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">Budget de 5000€ confirmé pour le projet</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-nexentry-blue/10 flex items-center justify-center text-nexentry-blue mr-2 mt-0.5">
                        2
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">Besoin de flexibilité sur les délais de livraison</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-nexentry-blue/10 flex items-center justify-center text-nexentry-blue mr-2 mt-0.5">
                        3
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">Interrogations sur notre service après-vente 24/7</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-nexentry-blue/10 flex items-center justify-center text-nexentry-blue mr-2 mt-0.5">
                        4
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">Démo planifiée le 20 avril avec l'équipe technique</p>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="pt-4">
            <div className="nexentry-card space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Objet</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="nexentry-input text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea 
                  value={emailBody} 
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="min-h-[300px] text-sm font-light"
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  className="bg-nexentry-blue" 
                  onClick={handleSendEmail}
                >
                  <SendHorizontal size={16} className="mr-2" />
                  Envoyer l'email
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CallSummaryPage;
