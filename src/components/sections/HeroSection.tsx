
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const HeroSection = () => {
  const [invitationCode, setInvitationCode] = useState("");

  const handleSubmitCode = () => {
    // In a real implementation, this would validate the code
    // and redirect to registration with the code pre-filled
    if (invitationCode.trim()) {
      window.location.href = `/register?code=${invitationCode}`;
    }
  };

  return (
    <section className="relative px-4 pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
          Repenser la façon dont vous <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">vendez.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          nexentry résume vos appels, génère vos relances, et optimise votre temps.
        </p>
        
        <div className="max-w-md mx-auto mb-4">
          <Button 
            className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:shadow-lg transition-all w-full sm:w-auto px-8 py-6"
            asChild
          >
            <Link to="/login">Essayer gratuitement</Link>
          </Button>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-sm text-blue-600 hover:underline">J'ai un code d'invitation</button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Code d'invitation</DialogTitle>
              <DialogDescription>
                Entrez votre code d'invitation pour accéder à des fonctionnalités exclusives.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="invitationCode">Code d'invitation</Label>
                <Input 
                  id="invitationCode" 
                  placeholder="Entrez votre code" 
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                />
              </div>
              <DialogClose asChild>
                <Button type="button" onClick={handleSubmitCode}>Valider</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default HeroSection;
