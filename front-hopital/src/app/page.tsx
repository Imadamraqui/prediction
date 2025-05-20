'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false);
  const [medecins, setMedecins] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsConnected(!!token);
  }, []);

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

  useEffect(() => {
    fetch("http://localhost:5000/api/departements")
      .then((res) => res.json())
      .then((data) => {
        console.log("Départements chargés :", data);
        setDepartements(data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des départements :", error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsConnected(false);
    window.location.href = '/';
  };

  // Afficher seulement les 3 premiers médecins
  const medecinsLimites = medecins.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Hôpital Digital</h1>
          <div className="flex items-center gap-4">
            {isConnected ? (
              <Button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Déconnexion
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => window.location.href = '/auth/login'}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Connexion
                </Button>
                <Button
                  onClick={() => window.location.href = '/auth/signup'}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Inscription
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Section Hero */}
      <section className="hero-section h-[600px]">
        <div className="hero-content container mx-auto px-4 h-full flex flex-col justify-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Bienvenue à l'Hôpital Digital
          </h2>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">
            Des soins de qualité pour votre santé, avec une équipe médicale professionnelle à votre service.
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={() => router.push('/auth/login')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-lg"
            >
              Prendre rendez-vous
            </Button>
            <Button 
              onClick={() => router.push('/auth/signup')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg rounded-lg"
            >
              S'inscrire
            </Button>
          </div>
        </div>
      </section>

      {/* Section Médecins */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-blue-600">Nos Médecins</h2>
              <p className="text-gray-600 mt-2">Découvrez notre équipe médicale</p>
            </div>
            <Button 
              onClick={() => router.push('/auth/medecins')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
            >
              Voir tous les médecins
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-12">
              <Card className="w-96">
                <CardHeader>
                  <CardTitle className="text-red-500">Erreur</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{error}</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {medecinsLimites.map((medecin: any) => (
                <Card
                  key={medecin.id}
                  className="w-72 shadow-md rounded-2xl hover:shadow-xl transition-all"
                >
                  <CardHeader className="flex flex-col items-center pt-6">
                    <Image
                      src={medecin.photo_url}
                      alt={`Photo de ${medecin.nom}`}
                      width={96}
                      height={96}
                      className="rounded-full border-4 border-white shadow mb-4"
                    />
                    <CardTitle className="text-lg font-semibold text-blue-800">
                      {medecin.nom}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{medecin.grade}</p>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl"
                      onClick={() => router.push(`/medecins/${medecin.id}`)}
                    >
                      Voir profil
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section Départements */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-blue-600">Nos Départements</h2>
              <p className="text-gray-600 mt-2">Découvrez nos services spécialisés</p>
            </div>
            <Button 
              onClick={() => router.push('/departements')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
            >
              Voir tous les départements
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-12">
              <Card className="w-96">
                <CardHeader>
                  <CardTitle className="text-red-500">Erreur</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{error}</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {departements.map((departement: any) => (
                <Card 
                  key={departement.id} 
                  className="hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => router.push(`/departements/${departement.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-blue-800">
                      {departement.nom_depart}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {departement.description || "Service médical spécialisé"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {departement.classe_pred || "Standard"}
                      </Badge>
                      <Badge variant="outline" className="text-blue-600">
                        {departement.nom_depart}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
