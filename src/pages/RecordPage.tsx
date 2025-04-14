
import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Upload, Circle, Square, Clock, Loader2 } from 'lucide-react';
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
  const [clientName, setClientName] = useState("Jean Dupont");
  const [context, setContext] = useState("Suivi d'implémentation CRM");

  // Dans un vrai cas, cette transcription viendrait d'un service de transcription
  // Pour cette démo, nous utilisons un script fictif
  const transcriptionRef = useRef("Bonjour Jean, merci de prendre le temps de discuter aujourd'hui. " +
    "Je voulais faire un suivi concernant notre dernière conversation sur l'implémentation du CRM. " +
    "Est-ce que votre équipe a eu le temps de consulter la documentation que je vous ai envoyée ? " +
    "Super, je suis content d'entendre que c'était utile. Concernant la formation, nous pouvons organiser une session la semaine prochaine. " +
    "Le jeudi 20 à 14h vous conviendrait ? Parfait, je vais réserver cette date. " +
    "Avez-vous d'autres questions sur le processus d'implémentation ? " +
    "Je comprends votre préoccupation concernant la migration des données. " +
    "Je vais vous mettre en contact avec notre spécialiste migration qui pourra vous aider avec ce point spécifique. " +
    "Merci pour votre temps aujourd'hui, je vous envoie un récapitulatif par email.");

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
      console.log('Début de l\'analyse avec OpenAI...');
      
      // Analyser la transcription avec l'API OpenAI
      const result = await analyzeCallTranscript(
        transcriptionRef.current,
        clientName,
        recordingTime,
        context
      );
      
      console.log('Analyse terminée avec succès', result);
      
      // Stocker les résultats dans le localStorage pour la démo
      localStorage.setItem('callAnalysis', JSON.stringify({
        ...result,
        clientName,
        duration: recordingTime,
        date: new Date().toISOString()
      }));
      
      // Rediriger vers le résumé d'appel
      navigate('/call-summary/new');
    } catch (error) {
      console.error("Erreur lors de l'analyse de l'appel:", error);
      setIsProcessing(false);
    }
  }, [navigate, recordingTime, timer, clientName, context]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      toast.info(`Fichier "${file.name}" en cours de traitement...`);
      setIsProcessing(true);
      
      try {
        // Pour cette démo, nous utilisons un script fictif pour le fichier également
        const mockTranscript = "Bonjour Marc, je vous appelle concernant le renouvellement de votre contrat. " +
          "Comme nous en avions discuté précédemment, il arrive à échéance le mois prochain. " +
          "Je voulais savoir si vous avez pris une décision concernant nos offres Pro et Premium ? " +
          "Je comprends que le budget est une préoccupation ce trimestre. " +
          "La bonne nouvelle est que nous pouvons vous proposer un tarif spécial si vous vous engagez pour 12 mois. " +
          "Cela vous permettrait d'accéder à l'offre Premium pour quasiment le prix de l'offre Pro. " +
          "Parfait, je vous envoie les détails de cette offre par email aujourd'hui. " +
          "Avez-vous d'autres questions ? " +
          "Excellent, merci pour votre temps et à bientôt !";
          
        const uploadClientName = "Marc Dubois";
        const mockDuration = 780; // Durée simulée de 13 minutes
        const uploadContext = "Renouvellement de contrat";
        
        try {
          console.log('Début de l\'analyse pour le fichier uploadé...');
          
          // Analyser la transcription avec l'API OpenAI
          const result = await analyzeCallTranscript(
            mockTranscript,
            uploadClientName,
            mockDuration,
            uploadContext
          );
          
          console.log('Analyse du fichier terminée avec succès', result);
          
          // Stocker les résultats dans le localStorage pour la démo
          localStorage.setItem('callAnalysis', JSON.stringify({
            ...result,
            clientName: uploadClientName,
            duration: mockDuration,
            date: new Date().toISOString()
          }));
          
          // Rediriger vers le résumé d'appel
          navigate('/call-summary/new');
        } catch (error) {
          console.error("Erreur lors de l'analyse du fichier:", error);
          toast.error("Une erreur est survenue lors de l'analyse. Veuillez réessayer plus tard.");
          setIsProcessing(false);
        }
      } catch (error) {
        console.error("Erreur lors de l'analyse du fichier:", error);
        toast.error("Erreur lors de l'analyse du fichier. Veuillez réessayer plus tard.");
        setIsProcessing(false);
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
                Assurez-vous que votre clé API OpenAI est correctement configurée dans les paramètres de votre compte.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RecordPage;
