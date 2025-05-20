'use client';
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MedecinCard from '@/components/MedecinCard';
import { useRouter } from 'next/navigation';

type Medecin = {
  id: number;
  nom: string;
  email: string;
  grade: string;
  photo_url: string;
};

export default function ListeMedecins() {
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

  // Afficher seulement les 3 premiers médecins
  const medecinsLimites = medecins.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Nos Médecins</h1>
          <p className="text-gray-600 mt-2">Découvrez notre équipe médicale</p>
        </div>
        <Button 
          onClick={() => router.push('/auth/medecins/liste')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
        >
          Voir tous les médecins
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {medecinsLimites.map((medecin) => (
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
