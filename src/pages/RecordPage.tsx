import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Loader2, AlertTriangle, User, Users, Briefcase, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { analyzeCallTranscript } from '@/api/aiApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import VoiceRecorder from '@/components/voice/VoiceRecorder';

const RecordPage = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientName, setClientName] = useState("");
  const [context, setContext] = useState("");
  const [notes, setNotes] = useState("");
  const [meetingType, setMeetingType] = useState("call"); // Default to call
  const [duration, setDuration] = useState(15); // Default 15 minutes
  const [error, setError] = useState<string | null>(null);
  const [retries, setRetries] = useState(0);
  const [useVoiceInput, setUseVoiceInput] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName) {
      toast.error("Le nom du contact est requis");
      return;
    }
    
    if (!notes || notes.length < 20) {
      toast.error("Merci d'ajouter plus de détails à votre résumé");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const durationInSeconds = duration * 60;
      await analyzeCallTranscript(notes, clientName, durationInSeconds, context);
      
      toast.success("Résumé créé avec succès");
      navigate('/call-summary/new');
    } catch (error) {
      console.error("Erreur lors de la création du résumé:", error);
      setError(error.message || "Une erreur est survenue lors de la création du résumé");
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setRetries(prev => prev + 1);
    setError(null);
    setIsProcessing(true);
    
    const durationInSeconds = duration * 60;
    analyzeCallTranscript(notes, clientName, durationInSeconds, context)
      .then(() => {
        navigate('/call-summary/new');
      })
      .catch(error => {
        setError(error.message || "Une erreur est survenue lors de la création du résumé");
        setIsProcessing(false);
      });
  };

  const handleVoiceTranscript = (transcript: string) => {
    setNotes(transcript);
    setUseVoiceInput(false);
    toast.success("Transcription ajoutée aux notes");
  };

  return (
    <Layout title="Nouveau résumé">
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
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsProcessing(false);
                      setError(null);
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
              </>
            ) : (
              <>
                <h3 className="text-xl font-medium mb-2">Création du résumé</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Notre IA analyse vos notes pour générer un résumé et des suggestions...
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Créer un nouveau résumé</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="nexentry-card">
                <h3 className="font-medium mb-3">Informations de base</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom du contact</label>
                    <Input
                      placeholder="Entrez le nom de votre contact"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="nexentry-input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Contexte (optionnel)</label>
                    <Input
                      placeholder="Ex: Prospection, Suivi, Support..."
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      className="nexentry-input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Type d'échange</label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={meetingType === "call" ? "default" : "outline"}
                        className="flex-1 gap-2"
                        onClick={() => setMeetingType("call")}
                      >
                        <User size={16} />
                        <span>Appel</span>
                      </Button>
                      <Button
                        type="button"
                        variant={meetingType === "meeting" ? "default" : "outline"}
                        className="flex-1 gap-2"
                        onClick={() => setMeetingType("meeting")}
                      >
                        <Users size={16} />
                        <span>Réunion</span>
                      </Button>
                      <Button
                        type="button"
                        variant={meetingType === "other" ? "default" : "outline"}
                        className="flex-1 gap-2"
                        onClick={() => setMeetingType("other")}
                      >
                        <Briefcase size={16} />
                        <span>Autre</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Durée approximative (min)</label>
                    <Input
                      type="number"
                      min="1"
                      max="120"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 15)}
                      className="nexentry-input"
                    />
                  </div>
                </div>
              </div>
              
              <div className="nexentry-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Notes de l'échange</h3>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setUseVoiceInput(!useVoiceInput)}
                  >
                    {useVoiceInput ? (
                      <>
                        <MessageSquare size={16} />
                        <span>Saisir du texte</span>
                      </>
                    ) : (
                      <>
                        <Mic size={16} />
                        <span>Utiliser ma voix</span>
                      </>
                    )}
                  </Button>
                </div>
                
                {useVoiceInput ? (
                  <div className="py-4">
                    <VoiceRecorder onTranscriptReady={handleVoiceTranscript} className="mb-4" />
                    
                    {notes && (
                      <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <p className="text-sm font-medium mb-1">Transcription:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{notes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <Textarea
                    placeholder="Décrivez les points importants de votre échange..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[150px]"
                  />
                )}
              </div>
              
              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                  Notre IA analysera vos notes pour générer automatiquement un résumé, des points clés et un email de suivi.
                </AlertDescription>
              </Alert>
              
              <Button 
                type="submit" 
                className="w-full bg-nexentry-blue" 
                size="lg"
                disabled={!clientName || !notes || notes.length < 20}
              >
                Créer un résumé
              </Button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RecordPage;
