'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false);
  const [medecins, setMedecins] = useState([]);
  const [departements, setDepartements] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsConnected(!!token);
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/medecins")
      .then((res) => res.json())
      .then((data) => {
        console.log("Médecins chargés :", data);
        setMedecins(data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des médecins :", error);
      });
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

  return (
    <div className="flex flex-col">
      {/* 🔹 Section Hero avec une image */}
      <section
        className="relative w-full h-[80vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/house.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute bottom-6 right-6 space-x-4 z-50">
          {isConnected ? (
            <>
              <Button variant="outline" onClick={() => (window.location.href = '/dashboard')}>
                Tableau de bord
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => (window.location.href = '/auth/login')}>
                Connexion
              </Button>
              <Button onClick={() => (window.location.href = '/auth/signup')}>
                Inscription
              </Button>
            </>
          )}
        </div>
      </section>

     {/* 🔸 Section Médecins */}
<section
  id="medecins"
  className="min-h-screen bg-blue-50 flex flex-col items-center justify-center py-20"
>
  <h2 className="text-4xl font-bold text-blue-900 mb-12">👩‍⚕️ Médecins disponibles</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
    {medecins.length > 0 ? (
      medecins.map((medecin: any) => (
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

          
            <Button
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl"
              onClick={() => window.location.href = `/medecins/${medecin.id}`}
            >
              Voir profil
            </Button>
          
        </Card>
      ))
    ) : (
      <p>Aucun médecin disponible.</p>
    )}
  </div>
</section>


      {/* 🔸 Section Départements */}
      <section id="departements" className="min-h-screen bg-green-50 flex flex-col items-center justify-center py-20">
        <h2 className="text-4xl font-bold text-green-900 mb-12">🏥 Départements</h2>
        <div className="flex gap-4 flex-wrap justify-center">
          {departements.length > 0 ? (
            departements.map((departement: any) => (
              <Badge key={departement.id} className="text-lg px-6 py-2 rounded-full bg-green-600 text-white">
                {departement.nom_depart} - {departement.classe_pred}
              </Badge>
            ))
          ) : (
            <p>Aucun département disponible.</p>
          )}
        </div>
      </section>

      {/* 🔸 Section Fonctionnalités */}
      <section id="fonctionnalites" className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center py-20">
        <h2 className="text-4xl font-bold text-yellow-900 mb-12">⚙️ Nos fonctionnalités</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl text-center">
          <Card>
            <CardHeader>
              <CardTitle>Prédictions intelligentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Analyse vos données pour prédire vos risques de santé.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recommandations personnalisées</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Des conseils adaptés à votre profil.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Interface intuitive</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Navigation fluide, tableau de bord simplifié.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 🔹 Section "Qui sommes-nous" */}
      <section
        id="about"
        className="min-h-screen bg-purple-50 flex flex-col items-center justify-center text-center px-8 py-20"
      >
        <h2 className="text-4xl font-bold text-purple-900 mb-8">À propos de nous</h2>
        <p className="max-w-3xl text-gray-700 text-lg">
          Santé+ est une plateforme dédiée à la santé connectée. Nous mettons en relation les patients et les professionnels
          de santé tout en offrant des prédictions intelligentes et des recommandations personnalisées.
        </p>
      </section>
    </div>
  );
}
