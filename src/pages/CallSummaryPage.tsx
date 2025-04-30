import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, Edit, Copy, SendHorizontal, User, Building, Tag, Mic, MessageSquare } from 'lucide-react';
import { formatDuration, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { AnalysisResult, generateEmailFromVoice } from '@/api/aiApi';
import VoiceMessageInput from '@/components/voice/VoiceMessageInput';

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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [callData, setCallData] = useState({
    date: new Date(),
    duration: 0,
    clientName: "",
    company: "",
    tags: [] as string[]
  });

  // Chargement des données d'analyse depuis localStorage
  useEffect(() => {
    try {
      // Effacer les états précédents pour éviter de mélanger les données
      setSummaryText("");
      setKeyPoints([]);
      setTags([]);
      setEmailSubject("");
      setEmailBody("");
      setCallData({
        date: new Date(),
        duration: 0,
        clientName: "",
        company: "",
        tags: []
      });
      
      console.log("Tentative de chargement de l'analyse depuis localStorage");
      const savedAnalysis = localStorage.getItem('callAnalysis');
      
      if (!savedAnalysis) {
        console.error("Aucune analyse trouvée dans localStorage");
        setLoadError("Aucune analyse d'appel trouvée. Veuillez enregistrer un appel d'abord.");
        return;
      }
      
      console.log("Analyse trouvée:", savedAnalysis);
      
      try {
        const analysis = JSON.parse(savedAnalysis) as AnalysisResult & {
          clientName?: string;
          duration?: number;
          date?: string;
        };
        
        console.log("Analyse parsée:", analysis);
        
        // Vérifier si l'analyse contient toutes les données nécessaires
        if (!analysis.summary || !analysis.key_points || !analysis.tags || !analysis.follow_up_email) {
          console.error("L'analyse ne contient pas toutes les données nécessaires", analysis);
          setLoadError("L'analyse est incomplète. Veuillez réessayer l'enregistrement.");
          return;
        }
        
        // Définir tous les états avec les données de l'analyse
        setSummaryText(analysis.summary);
        setKeyPoints(analysis.key_points || []);
        setTags(analysis.tags || []);
        setEmailSubject(analysis.follow_up_email?.subject || "");
        setEmailBody(analysis.follow_up_email?.body || "");
        
        // Récupérer les metadata de l'appel
        setCallData({
          date: analysis.date ? new Date(analysis.date) : new Date(),
          duration: analysis.duration || 0,
          clientName: analysis.clientName || "Client",
          company: "Entreprise", // Valeur par défaut
          tags: analysis.tags || []
        });
        
        console.log("Données chargées avec succès:", {
          summary: analysis.summary,
          keyPoints: analysis.key_points,
          emailSubject: analysis.follow_up_email?.subject,
          clientName: analysis.clientName,
          duration: analysis.duration
        });
        
        setAnalysisLoaded(true);
        setLoadError(null);
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        setLoadError(`Erreur de format JSON: ${parseError.message}`);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'analyse:', error);
      setLoadError(`Erreur lors du chargement de l'analyse: ${error.message}`);
    }
  }, [id]); // id dans la dépendance pour recharger si l'URL change

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSaveSummary = () => {
    setIsEditing(false);
    toast.success("Résumé enregistré");
    
    // Mettre à jour dans localStorage
    const savedAnalysis = localStorage.getItem('callAnalysis');
    if (savedAnalysis) {
      const analysis = JSON.parse(savedAnalysis);
      analysis.summary = summaryText;
      localStorage.setItem('callAnalysis', JSON.stringify(analysis));
    }
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(summaryText);
    toast.success("Résumé copié dans le presse-papier");
  };

  const handleSendEmail = () => {
    // Mise à jour de l'email dans localStorage avant d'envoyer
    const savedAnalysis = localStorage.getItem('callAnalysis');
    if (savedAnalysis) {
      const analysis = JSON.parse(savedAnalysis);
      analysis.follow_up_email = {
        subject: emailSubject,
        body: emailBody
      };
      localStorage.setItem('callAnalysis', JSON.stringify(analysis));
    }
    
    toast.success("Email envoyé avec succès");
    navigate("/calls");
  };

  const handleVoiceToEmail = async (transcript: string) => {
    try {
      toast.info("Génération de l'email en cours...");
      const result = await generateEmailFromVoice(transcript, callData.clientName, 'email');
      
      if (result && result.subject && result.body) {
        setEmailSubject(result.subject);
        setEmailBody(result.body);
        
        // Change to email tab
        setActiveTab("email");
        
        toast.success("Email généré à partir de votre message vocal");
      } else {
        toast.error("Échec de la génération de l'email");
      }
    } catch (error) {
      console.error("Erreur lors de la génération de l'email:", error);
      toast.error("Impossible de générer l'email. Veuillez réessayer plus tard.");
    }
  };
  
  const handleVoiceToSMS = async (transcript: string) => {
    try {
      toast.info("Génération du SMS en cours...");
      const result = await generateEmailFromVoice(transcript, callData.clientName, 'sms');
      
      if (result && result.body) {
        // For SMS, we only need the body but display it in the email tab
        setEmailSubject("SMS à " + callData.clientName);
        setEmailBody(result.body);
        
        // Change to email tab
        setActiveTab("email");
        
        toast.success("SMS généré à partir de votre message vocal");
      } else {
        toast.error("Échec de la génération du SMS");
      }
    } catch (error) {
      console.error("Erreur lors de la génération du SMS:", error);
      toast.error("Impossible de générer le SMS. Veuillez réessayer plus tard.");
    }
  };

  if (loadError) {
    return (
      <Layout 
        title="Résumé d'appel" 
        showBackButton={true}
        onBackClick={handleGoBack}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-500 mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
            {loadError}
          </p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => navigate('/record')}
          >
            Enregistrer un nouvel appel
          </Button>
        </div>
      </Layout>
    );
  }

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
              <h2 className="text-xl font-semibold">{callData.clientName || "Client"}</h2>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
                <Building size={14} className="mr-1" />
                {callData.company || "Entreprise"}
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
            {callData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
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
                  <p>{summaryText || "Aucun résumé disponible pour cet appel."}</p>
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
                  <li className="text-gray-500">Aucun point clé disponible pour cet appel.</li>
                )}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="pt-4">
            <div className="nexentry-card space-y-4">
              {/* Voice Input Options */}
              <div className="flex flex-wrap gap-2 mb-2">
                <VoiceMessageInput 
                  onMessageReady={handleVoiceToEmail}
                  title="Dicter un email"
                  description="Enregistrez un message vocal pour générer un email de suivi"
                  buttonText="Dicter un email"
                />
                
                <VoiceMessageInput 
                  onMessageReady={handleVoiceToSMS}
                  title="Dicter un SMS"
                  description="Enregistrez un message vocal pour générer un SMS concis"
                  buttonText="Dicter un SMS"
                />
              </div>
              
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
