
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import VoiceRecorder from './VoiceRecorder';
import { Mic, X, CheckCheck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface VoiceMessageInputProps {
  onMessageReady: (text: string) => void;
  title?: string;
  description?: string;
  buttonText?: string;
}

const VoiceMessageInput: React.FC<VoiceMessageInputProps> = ({
  onMessageReady,
  title = "Message vocal",
  description = "Enregistrez un message vocal pour générer un texte",
  buttonText = "Enregistrer un message"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleTranscriptReady = (text: string) => {
    setTranscript(text);
    setIsEditing(true);
  };

  const handleConfirm = () => {
    if (transcript.trim()) {
      onMessageReady(transcript);
      setIsOpen(false);
      setTranscript("");
      setIsEditing(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Mic className="h-4 w-4" />
        {buttonText}
      </Button>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          
          <div className="py-6">
            {!isEditing ? (
              <VoiceRecorder onTranscriptReady={handleTranscriptReady} />
            ) : (
              <div className="space-y-4">
                <Textarea 
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Contenu de votre message..."
                  className="min-h-[200px]"
                />
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)} 
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Annuler l'édition
                  </Button>
                  
                  <Button 
                    onClick={handleConfirm}
                    className="flex items-center gap-2 bg-nexentry-blue hover:bg-nexentry-blue/90"
                  >
                    <CheckCheck className="h-4 w-4" />
                    Confirmer
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default VoiceMessageInput;
