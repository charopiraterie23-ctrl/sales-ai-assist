
import { useState, useCallback, useRef, useEffect } from 'react';
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
  const [clientName, setClientName] = useState("Jean Dupont");
  const [context, setContext] = useState("Suivi d'implémentation CRM");
  const [error, setError] = useState<string | null>(null);
  const [retries, setRetries] = useState(0);
  const [isShortenedTranscript, setShortenedTranscript] = useState(false);

  // Utiliser une transcription réaliste pour les tests
  const transcriptionRef = useRef("Bonjour Jean, merci de prendre le temps de discuter aujourd'hui. " +
    "Je voulais faire un suivi concernant notre dernière conversation sur l'implémentation du CRM. " +
    "Est-ce que votre équipe a eu le temps de consulter la documentation que je vous ai envoyée ? " +
    "Super, je suis content d'entendre que c'était utile. Concernant la formation, nous pouvons organiser une session la semaine prochaine. " +
    "Le jeudi 20 à 14h vous conviendrait ? Parfait, je vais réserver cette date. " +
    "Avez-vous d'autres questions sur le processus d'implémentation ? " +
    "Je comprends votre préoccupation concernant la migration des données. " +
    "Je vais vous mettre en contact avec notre spécialiste migration qui pourra vous aider avec ce point spécifique. " +
    "Merci pour votre temps aujourd'hui, je vous envoie un récapitulatif par email.");

  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setError(null);
    setShortenedTranscript(false);
    
    const intervalId = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    setTimer(intervalId);
    
    toast.info('Enregistrement démarré');
  };

  const sendAnalysisRequest = async (text: string, name: string, time: number, additionalContext?: string) => {
    try {
      console.log(`Envoi d'une demande d'analyse - Longueur transcription: ${text.length} caractères`);
      console.log(`Analyse pour client: ${name}, durée: ${time}s, contexte: ${additionalContext || 'aucun'}`);
      
      // Supprimer les données précédentes pour éviter de les mélanger
      localStorage.removeItem('callAnalysis');
      
      const result = await analyzeCallTranscript(
        text,
        name,
        time,
        additionalContext
      );
      
      console.log('Analyse terminée avec succès', result);
      
      navigate('/call-summary/new');
    } catch (error) {
      console.error("Erreur lors de l'analyse de l'appel:", error);
      setError(error.message || "Une erreur est survenue lors de l'analyse");
      setIsProcessing(false);
      
      // Si nous n'avons pas encore essayé avec une transcription réduite
      if (!isShortenedTranscript && text.length > 300) {
        toast.warning("Nouvelle tentative avec une transcription plus courte...");
        setShortenedTranscript(true);
        
        // On attend un peu avant de réessayer
        setTimeout(() => {
          const shorterText = text.substring(0, Math.min(300, text.length));
          setIsProcessing(true);
          sendAnalysisRequest(shorterText, name, time, additionalContext);
        }, 2000);
      }
    }
  };

  const stopRecording = useCallback(async () => {
    setIsRecording(false);
    
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    
    toast.success('Enregistrement terminé');
    
    setIsProcessing(true);
    setError(null);
    
    await sendAnalysisRequest(transcriptionRef.current, clientName, recordingTime, context);
    
  }, [navigate, recordingTime, timer, clientName, context]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      toast.info(`Fichier "${file.name}" en cours de traitement...`);
      setIsProcessing(true);
      setError(null);
      setShortenedTranscript(false);
      
      // Simuler une transcription pour le test d'upload
      const mockTranscript = "Bonjour Marc, je vous appelle concernant le renouvellement de votre contrat. " +
        "Comme nous en avions discuté précédemment, il arrive à échéance le mois prochain. " +
        "Je voulais savoir si vous avez pris une décision concernant nos offres Pro et Premium ? " +
        "Je comprends que le budget est une préoccupation ce trimestre.";
          
      const uploadClientName = "Marc Dubois";
      const mockDuration = 120; // 2 minutes
      const uploadContext = "Renouvellement de contrat";
      
      await sendAnalysisRequest(mockTranscript, uploadClientName, mockDuration, uploadContext);
    }
  };

  const handleRetry = () => {
    setRetries(prev => prev + 1);
    setError(null);
    setIsProcessing(true);
    
    // Réduire la taille de la transcription pour le test
    const shortTranscript = "Bonjour Jean. Merci pour notre conversation sur le CRM. " + 
      "La formation est prévue jeudi prochain. Je vous envoie un récapitulatif par email.";
    
    sendAnalysisRequest(shortTranscript, clientName, recordingTime, context);
  };

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
              {error ? 
                <AlertTriangle className="w-full h-full text-red-500" /> : 
                <Loader2 className="w-full h-full text-nexentry-blue animate-spin" />
              }
            </div>
            
            {error ? (
              <>
                <h3 className="text-xl font-medium mb-2 text-red-500">Erreur lors de l'analyse</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
                  {error}
                </p>
                {isShortenedTranscript && (
                  <p className="text-amber-600 dark:text-amber-400 text-sm mb-4">
                    La tentative avec une transcription plus courte a également échoué.
                  </p>
                )}
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsProcessing(false);
                      setError(null);
                      setShortenedTranscript(false);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleRetry}
                    className="bg-nexentry-blue"
                  >
                    Réessayer
                  </Button>
                </div>
                <div className="mt-4 max-w-md mx-auto">
                  <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                    <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                      Si le problème persiste, vérifiez que votre clé API OpenAI est valide et que vous avez des crédits disponibles sur votre compte OpenAI.
                    </AlertDescription>
                  </Alert>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-medium mb-2">Analyse en cours</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Notre IA analyse votre conversation pour générer un résumé et des suggestions...
                </p>
                {isShortenedTranscript && (
                  <p className="text-amber-600 dark:text-amber-400 text-sm mt-4">
                    Utilisation d'une transcription réduite pour éviter les erreurs...
                  </p>
                )}
              </>
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
