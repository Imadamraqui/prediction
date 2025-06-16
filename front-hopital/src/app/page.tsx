'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Medecin {
  id: number;
  nom: string;
  grade: string;
  photo_url?: string;
}

interface Departement {
  id: number;
  nom_depart: string;
  description?: string;
  classe_pred?: string;
}

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false);
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [departements, setDepartements] = useState<Departement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentHero, setCurrentHero] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const router = useRouter();

  const heroes = [
    {
      title: "Bienvenue à l'Hôpital Digital",
      description: "Des soins de qualité pour votre santé, avec une équipe médicale professionnelle à votre service.",
      buttons: [{ text: "S'inscrire", onClick: () => router.push('/auth/signup'), className: "bg-white text-blue-700 hover:bg-gray-200" }],
      bgImage: "/images/hero-1.jpg"
    },
    {
      title: "Prédiction de Santé Intelligente",
      description: "Utilisez notre système d'IA pour analyser vos données de santé et obtenir des prédictions personnalisées.",
      buttons: [
        { text: "Faire une prédiction", onClick: () => router.push('/prediction'), className: "bg-blue-700 text-white hover:bg-blue-800" },
        { text: "En savoir plus", onClick: () => router.push('/prediction/about'), className: "border border-white text-white hover:bg-white hover:text-blue-700" }
      ],
      bgImage: "/images/heroPredict.png"
    },
    {
      title: "Assistant Virtuel 24/7",
      description: "Notre chatbot médical est disponible à tout moment pour répondre à vos questions de santé.",
      buttons: [
        { text: "Discuter maintenant", onClick: () => router.push('/chatbot'), className: "bg-white text-blue-700 hover:bg-gray-100" },
        { text: "Découvrir les fonctionnalités", onClick: () => router.push('/chatbot/features'), className: "border border-white text-white hover:bg-white hover:text-blue-700" }
      ],
      bgImage: "/images/heroChat.png"
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsConnected(!!token);

    const handleScroll = () => {
      const cards = document.querySelectorAll('.fade-in');
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          card.classList.add('opacity-100', 'translate-y-0');
          card.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMedecins = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/medecins');
        const data = await res.json();
        setMedecins(data);
      } catch (err) {
        setError('Erreur lors de la récupération des médecins');
      }
    };
    fetchMedecins();
  }, []);

  useEffect(() => {
    const fetchDepartements = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/departements');
        const data = await res.json();
        setDepartements(data);
      } catch (err) {
        setError('Erreur lors de la récupération des départements');
      }
    };
    fetchDepartements();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentHero((prev) => (prev + 1) % heroes.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div className="min-h-screen">
      <section className="relative h-[100vh] overflow-hidden">
        {heroes.map((hero, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHero ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${hero.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="h-full w-full flex flex-col justify-center items-start px-8 md:px-24 text-white">
              <h2 className="text-5xl font-bold mb-4 animate-fade-in-up drop-shadow-xl">{hero.title}</h2>
              <p className="text-xl max-w-2xl mb-6 animate-fade-in-up drop-shadow-md">{hero.description}</p>
              <div className="flex gap-4 animate-fade-in-up">
                {hero.buttons.map((btn, i) => (
                  <Button key={i} onClick={btn.onClick} className={`${btn.className} px-6 py-2 rounded-lg`}>{btn.text}</Button>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {heroes.map((_, i) => (
            <div key={i} onClick={() => setCurrentHero(i)} className={`w-3 h-3 rounded-full ${currentHero === i ? 'bg-white' : 'bg-gray-400'} cursor-pointer`}></div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-10 text-blue-800">Nos Médecins</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {medecins.slice(0, 3).map((medecin, idx) => (
              <div key={medecin.id} className="fade-in opacity-0 translate-y-10 transition-all duration-700 bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col items-center">
                  <Image src={medecin.photo_url || '/images/default-avatar.png'} width={90} height={90} className="rounded-full mb-4" alt={medecin.nom} />
                  <h3 className="text-xl font-semibold text-blue-700">{medecin.nom}</h3>
                  <p className="text-blue-500 text-sm mb-4">{medecin.grade}</p>
                  <Button onClick={() => router.push(`/auth/medecins/${medecin.id}`)} className="bg-blue-600 text-white hover:bg-blue-700 mt-2 px-4 py-2 rounded">Voir le profil</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-10 text-purple-700">Nos Départements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departements.map((departement, idx) => (
              <div key={departement.id} onClick={() => router.push(`/departements/${departement.id}`)} className="fade-in opacity-0 translate-y-10 transition-all duration-700 bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:scale-[1.03]">
                <h3 className="text-xl font-bold text-purple-800 mb-2">{departement.nom_depart}</h3>
                <p className="text-gray-600 mb-4">{departement.description || 'Découvrez les services offerts.'}</p>
                {departement.classe_pred && <Badge className="bg-purple-100 text-purple-800 font-medium px-3 py-1 rounded-full">{departement.classe_pred}</Badge>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
