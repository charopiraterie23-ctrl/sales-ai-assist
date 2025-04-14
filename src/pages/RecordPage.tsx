
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Upload, Circle, Square, Clock, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { analyzeCallTranscript } from '@/api/aiApi';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RecordPage = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Start timer
    const intervalId = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    setTimer(intervalId);
    
    toast.info('Enregistrement démarré');
  };

  const stopRecording = useCallback(async () => {
    setIsRecording(false);
    
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    
    toast.success('Enregistrement terminé');
    
    // Simuler la transcription
    setIsProcessing(true);
    
    try {
      // Simulation de transcription (dans un vrai cas, vous recevriez ceci d'un service de transcription)
      // Cet exemple utilise une transcription fictive pour démonstration
      const mockTranscript = "Bonjour Jean, merci de prendre le temps de discuter aujourd'hui. " +
        "Je voulais faire un suivi concernant notre dernière conversation sur l'implémentation du CRM. " +
        "Est-ce que votre équipe a eu le temps de consulter la documentation que je vous ai envoyée ? " +
        "Super, je suis content d'entendre que c'était utile. Concernant la formation, nous pouvons organiser une session la semaine prochaine. " +
        "Le jeudi 20 à 14h vous conviendrait ? Parfait, je vais réserver cette date. " +
        "Avez-vous d'autres questions sur le processus d'implémentation ? " +
        "Je comprends votre préoccupation concernant la migration des données. " +
        "Je vais vous mettre en contact avec notre spécialiste migration qui pourra vous aider avec ce point spécifique. " +
        "Merci pour votre temps aujourd'hui, je vous envoie un récapitulatif par email.";
      
      setTranscript(mockTranscript);
      
      // Analyser la transcription avec l'API OpenAI
      const result = await analyzeCallTranscript(
        mockTranscript,
        "Jean Dupont", // Dans un cas réel, ceci viendrait d'un sélecteur de client
        recordingTime,
        "Suivi d'implémentation CRM"
      );
      
      // Vérifier si nous sommes en mode démo (si l'API a retourné une erreur)
      if ((result as any).fallback || (result as any).isDemoData) {
        setIsDemoMode(true);
      }
      
      // Stocker les résultats dans le localStorage pour la démo
      // Dans un cas réel, vous les stockeriez dans votre base de données
      localStorage.setItem('callAnalysis', JSON.stringify({
        ...result,
        isDemoMode,
        clientName: "Jean Dupont",
        duration: recordingTime,
        date: new Date().toISOString()
      }));
      
      // Rediriger vers le résumé d'appel
      navigate('/call-summary/new');
    } catch (error) {
      console.error("Erreur lors de l'analyse de l'appel:", error);
      toast.error("Une erreur est survenue. Mode démo activé.");
      setIsDemoMode(true);
      
      try {
        // En cas d'erreur, utiliser des données de démo
        const demoResult = {
          summary: "Discussion sur l'implémentation du CRM avec planification d'une formation.",
          key_points: [
            "Documentation consultée par le client",
            "Formation planifiée pour le jeudi 20",
            "Questions sur la migration des données",
            "Mise en contact avec un spécialiste prévue"
          ],
          tags: ["formation", "crm", "migration", "implementation"],
          follow_up_email: {
            subject: "Récapitulatif - Implémentation CRM et formation",
            body: "Bonjour Jean,\n\nMerci pour notre conversation d'aujourd'hui concernant l'implémentation du CRM.\n\nJe confirme notre session de formation prévue le jeudi 20 à 14h.\n\nNotre spécialiste migration vous contactera prochainement.\n\nCordialement,\nL'équipe Nexentry"
          },
          isDemoMode: true,
          clientName: "Jean Dupont",
          duration: recordingTime,
          date: new Date().toISOString()
        };
        
        localStorage.setItem('callAnalysis', JSON.stringify(demoResult));
        navigate('/call-summary/new');
      } catch (fallbackError) {
        console.error("Erreur lors de la création des données de démo:", fallbackError);
        setIsProcessing(false);
      }
    }
  }, [navigate, recordingTime, timer]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      toast.info(`Fichier "${file.name}" en cours de traitement...`);
      setIsProcessing(true);
      
      try {
        // Simulation de transcription pour un fichier
        // Dans un vrai cas, vous enverriez le fichier à un service de transcription
        setTimeout(async () => {
          const mockTranscript = "Bonjour Marc, je vous appelle concernant le renouvellement de votre contrat. " +
            "Comme nous en avions discuté précédemment, il arrive à échéance le mois prochain. " +
            "Je voulais savoir si vous avez pris une décision concernant nos offres Pro et Premium ? " +
            "Je comprends que le budget est une préoccupation ce trimestre. " +
            "La bonne nouvelle est que nous pouvons vous proposer un tarif spécial si vous vous engagez pour 12 mois. " +
            "Cela vous permettrait d'accéder à l'offre Premium pour quasiment le prix de l'offre Pro. " +
            "Parfait, je vous envoie les détails de cette offre par email aujourd'hui. " +
            "Avez-vous d'autres questions ? " +
            "Excellent, merci pour votre temps et à bientôt !";
          
          setTranscript(mockTranscript);
          
          try {
            // Analyser la transcription avec l'API OpenAI
            const result = await analyzeCallTranscript(
              mockTranscript,
              "Marc Dubois", // Dans un cas réel, ceci viendrait d'un sélecteur de client
              780, // Durée simulée de 13 minutes
              "Renouvellement de contrat"
            );
            
            // Vérifier si nous sommes en mode démo
            if ((result as any).fallback || (result as any).isDemoData) {
              setIsDemoMode(true);
            }
            
            // Stocker les résultats dans le localStorage pour la démo
            localStorage.setItem('callAnalysis', JSON.stringify({
              ...result,
              isDemoMode,
              clientName: "Marc Dubois",
              duration: 780,
              date: new Date().toISOString()
            }));
            
            // Rediriger vers le résumé d'appel
            navigate('/call-summary/new');
          } catch (error) {
            console.error("Erreur lors de l'analyse du fichier:", error);
            setIsDemoMode(true);
            toast.error("Une erreur est survenue. Mode démo activé.");
            
            // En cas d'erreur, utiliser des données de démo
            const demoResult = {
              summary: "Discussion sur le renouvellement de contrat avec proposition d'offre spéciale.",
              key_points: [
                "Contrat arrivant à échéance le mois prochain",
                "Contraintes budgétaires pour ce trimestre",
                "Offre Premium au prix de Pro pour un engagement de 12 mois",
                "Envoi des détails de l'offre par email"
              ],
              tags: ["renouvellement", "contrat", "negociation", "offre_speciale"],
              follow_up_email: {
                subject: "Détails de notre offre spéciale - Renouvellement",
                body: "Bonjour Marc,\n\nSuite à notre conversation, voici les détails de notre offre spéciale.\n\nOffre Premium au tarif Pro pour un engagement de 12 mois, incluant toutes les fonctionnalités Premium.\n\nCette offre est valable jusqu'à la fin du mois.\n\nCordialement,\nL'équipe Nexentry"
              },
              isDemoMode: true,
              clientName: "Marc Dubois",
              duration: 780,
              date: new Date().toISOString()
            };
            
            localStorage.setItem('callAnalysis', JSON.stringify(demoResult));
            navigate('/call-summary/new');
          }
        }, 2000);
      } catch (error) {
        console.error("Erreur lors de l'analyse du fichier:", error);
        toast.error("Erreur lors de l'analyse du fichier. Mode démo activé.");
        setIsProcessing(false);
        setIsDemoMode(true);
      }
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout title="Enregistrer">
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        {isProcessing ? (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6">
              <Loader2 className="w-full h-full text-nexentry-blue animate-spin" />
            </div>
            <h3 className="text-xl font-medium mb-2">Analyse en cours</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Notre IA analyse votre conversation pour générer un résumé et des suggestions...
            </p>
            {isDemoMode && (
              <Alert className="mt-4 max-w-md mx-auto bg-amber-50 dark:bg-amber-900/20">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  Mode démo activé : Des données simulées sont utilisées car l'API OpenAI n'est pas disponible actuellement.
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : isRecording ? (
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-red-200 dark:bg-red-800/30 flex items-center justify-center animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
                    <Circle className="h-3 w-3 text-white fill-white" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-1 text-red-500">
                  <Circle className="h-2 w-2 fill-current animate-pulse" />
                  <span className="text-sm font-medium">REC</span>
                </div>
              </div>
            </div>
            
            <div className="text-3xl font-semibold mb-8 font-mono">
              <Clock className="inline-block mr-2 h-5 w-5" />
              {formatTime(recordingTime)}
            </div>
            
            <Button 
              onClick={stopRecording} 
              size="lg"
              variant="outline"
              className="rounded-full h-14 w-14 p-0 border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Square className="h-5 w-5" />
              <span className="sr-only">Arrêter l'enregistrement</span>
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6">Nouvel appel</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div 
                className="nexentry-card hover:border-nexentry-blue hover:shadow-md cursor-pointer flex flex-col items-center justify-center p-8"
                onClick={startRecording}
              >
                <div className="w-16 h-16 rounded-full bg-nexentry-blue flex items-center justify-center mb-4">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2">Enregistrer</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enregistrer votre appel directement
                </p>
              </div>
              
              <label className="nexentry-card hover:border-nexentry-blue hover:shadow-md cursor-pointer flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 rounded-full bg-nexentry-blue flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2">Importer</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uploader un fichier audio existant
                </p>
                <input 
                  type="file" 
                  accept="audio/*" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Votre appel sera transcrit et analysé par notre IA pour vous fournir un résumé et des suggestions.
            </p>
            
            <Alert className="mt-6 max-w-md mx-auto bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                En cas d'indisponibilité de l'API OpenAI, le système passera automatiquement en mode démonstration avec des données simulées.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RecordPage;
