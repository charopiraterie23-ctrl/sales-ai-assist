
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Trash2 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/components/ui/sonner';

import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  company: z.string().optional(),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }).optional().or(z.literal('')),
  phone: z.string().optional(),
  status: z.enum(['lead', 'intéressé', 'en attente', 'conclu', 'perdu']),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Client {
  clientId: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  lastContacted: Date;
  status: 'lead' | 'intéressé' | 'en attente' | 'conclu' | 'perdu';
  notes?: string;
}

const EditClientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [client, setClient] = useState<Client | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      company: '',
      email: '',
      phone: '',
      status: 'lead',
      notes: '',
    },
  });

  useEffect(() => {
    // Simulate API call to fetch client details
    setIsLoading(true);
    setTimeout(() => {
      // Mock data - in a real app, this would come from an API
      const foundClient = {
        clientId: '1',
        fullName: 'Jean Dupont',
        company: 'ABC Technologies',
        email: 'jean.dupont@abctech.com',
        phone: '06 12 34 56 78',
        lastContacted: new Date(2023, 3, 15),
        status: 'intéressé' as const,
        notes: 'Intéressé par notre solution SaaS. À relancer dans 2 semaines.',
      };
      
      setClient(foundClient);
      form.reset({
        fullName: foundClient.fullName,
        company: foundClient.company,
        email: foundClient.email,
        phone: foundClient.phone,
        status: foundClient.status,
        notes: foundClient.notes,
      });
      setIsLoading(false);
    }, 1000);
  }, [id, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    // Simulate API call to update client
    setTimeout(() => {
      // Here you would call your API to update the client
      console.log('Updated client data:', data);
      toast.success('Le client a été mis à jour avec succès');
      setIsSubmitting(false);
      navigate(`/client/${id}`);
    }, 1000);
  };

  const handleDelete = () => {
    // Simulate API call to delete client
    setTimeout(() => {
      // Here you would call your API to delete the client
      toast.success('Le client a été supprimé avec succès');
      navigate('/clients');
    }, 1000);
  };

  return (
    <Layout title="Modifier le client">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => navigate(`/client/${id}`)}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-1">
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous certain?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Cela supprimera définitivement le client
                  et toutes les données associées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Confirmer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entreprise</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="lead">Lead</SelectItem>
                          <SelectItem value="intéressé">Intéressé</SelectItem>
                          <SelectItem value="en attente">En attente</SelectItem>
                          <SelectItem value="conclu">Conclu</SelectItem>
                          <SelectItem value="perdu">Perdu</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="min-h-32" 
                        placeholder="Ajoutez des informations supplémentaires sur ce client..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </Layout>
  );
};

export default EditClientPage;
