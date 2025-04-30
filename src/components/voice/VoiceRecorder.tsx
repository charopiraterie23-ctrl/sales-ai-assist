
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2, AlertCircle } from "lucide-react";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VoiceRecorderProps {
  onTranscriptReady: (transcript: string) => void;
  className?: string;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscriptReady, className = "" }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });
      
      mediaRecorder.addEventListener('stop', () => {
        handleAudioData();
      });
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast.info("Enregistrement en cours...");
    } catch (err) {
      console.error("Erreur lors de l'accès au microphone:", err);
      setError("Impossible d'accéder au microphone. Veuillez vérifier les permissions de votre navigateur.");
      toast.error("Impossible d'accéder au microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleAudioData = async () => {
    if (audioChunksRef.current.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const reader = new FileReader();
      
      reader.onload = async () => {
        if (!reader.result || typeof reader.result !== 'string') {
          throw new Error("Échec de la lecture de l'enregistrement audio");
        }
        
        // Extract base64 data (remove data URL prefix)
        const base64Audio = reader.result.split(',')[1];
        
        try {
          const { data, error } = await supabase.functions.invoke('voice-to-text', {
            body: { audio: base64Audio, language: 'fr' }
          });
          
          if (error) throw error;
          
          if (data && data.text) {
            toast.success("Transcription réussie");
            onTranscriptReady(data.text);
          } else {
            throw new Error("Aucun texte reçu de la transcription");
          }
        } catch (err: any) {
          console.error("Erreur lors de la transcription:", err);
          setError("Erreur lors de la transcription: " + (err.message || err));
          toast.error("Échec de la transcription");
        } finally {
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        setError("Erreur lors de la lecture du fichier audio");
        setIsProcessing(false);
        toast.error("Erreur de lecture audio");
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (err) {
      console.error("Erreur lors du traitement de l'audio:", err);
      setError("Erreur lors du traitement de l'audio");
      setIsProcessing(false);
      toast.error("Erreur de traitement audio");
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="mb-2 text-center">
        {isRecording ? (
          <Button 
            variant="destructive" 
            size="lg"
            className="rounded-full p-3 h-16 w-16 flex items-center justify-center"
            onClick={stopRecording}
            disabled={isProcessing}
          >
            <Square size={24} />
          </Button>
        ) : (
          <Button 
            variant="default" 
            size="lg"
            className="rounded-full p-3 h-16 w-16 bg-nexentry-blue hover:bg-nexentry-blue/90 flex items-center justify-center"
            onClick={startRecording}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="h-8 w-8 animate-spin" /> : <Mic size={24} />}
          </Button>
        )}
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {isRecording
          ? "Cliquez pour arrêter l'enregistrement"
          : isProcessing
          ? "Transcription en cours..."
          : "Cliquez pour enregistrer votre message vocal"}
      </p>
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
