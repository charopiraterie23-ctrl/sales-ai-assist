
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Upload, Circle, Square, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';

const RecordPage = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);

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

  const stopRecording = () => {
    setIsRecording(false);
    
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    
    toast.success('Enregistrement terminé');
    
    // Simulate processing and redirect to call summary
    setTimeout(() => {
      navigate('/call-summary/new');
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      toast.info(`Fichier "${file.name}" en cours de traitement...`);
      
      // Simulate processing and redirect to call summary
      setTimeout(() => {
        navigate('/call-summary/new');
      }, 2000);
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
        {isRecording ? (
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RecordPage;
