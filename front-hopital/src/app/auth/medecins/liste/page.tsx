'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MedecinCard from '@/components/MedecinCard';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type Medecin = {
  id: number;
  nom: string;
  email: string;
  grade: string;
  photo_url: string;
};

export default function ListeCompleteMedecins() {
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMedecins = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/medecins');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des médecins');
        }
        const data = await response.json();
        setMedecins(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchMedecins();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-500">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Liste Complète des Médecins</h1>
        <Button 
          onClick={() => router.push('/auth/medecins')}
          variant="outline"
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          Retour
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medecins.map((medecin) => (
          <MedecinCard 
            key={medecin.id} 
            medecin={{
              id: medecin.id,
              nom: medecin.nom,
              specialite: medecin.grade,
              photo_url: medecin.photo_url
            }} 
          />
        ))}
      </div>
    </div>
  );
} 