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

  // State for header shadow on scroll
  const [headerShadow, setHeaderShadow] = useState(false);

  const [currentHero, setCurrentHero] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const heroes = [
    {
      title: "Bienvenue à l'Hôpital Digital",
      description: "Des soins de qualité pour votre santé, avec une équipe médicale professionnelle à votre service.",
      buttons: [
       
        {
          text: "S'inscrire",
          onClick: () => router.push('/auth/signup'),
          className: "border-white text-white hover:bg-white hover:text-blue-600"
        }
      ],
      bgImage: "/images/hero-1.jpg"
    },
    {
      title: "Prédiction de Santé Intelligente",
      description: "Utilisez notre système d'IA pour analyser vos données de santé et obtenir des prédictions personnalisées.",
      buttons: [
        {
          text: "Faire une prédiction",
          onClick: () => router.push('/prediction'),
          className: "bg-white text-blue-600 hover:bg-gray-100"
        },
        {
          text: "En savoir plus",
          onClick: () => router.push('/prediction/about'),
          className: "border-white text-white hover:bg-white hover:text-blue-600"
        }
      ],
      bgImage: "/images/heroPredict.png"
    },
    {
      title: "Assistant Virtuel 24/7",
      description: "Notre chatbot médical est disponible à tout moment pour répondre à vos questions de santé.",
      buttons: [
        {
          text: "Discuter maintenant",
          onClick: () => router.push('/chatbot'),
          className: "bg-white text-blue-600 hover:bg-gray-100"
        },
        {
          text: "Découvrir les fonctionnalités",
          onClick: () => router.push('/chatbot/features'),
          className: "border-white text-white hover:bg-white hover:text-blue-600"
        }
      ],
      bgImage: "/images/heroChat.png"
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsConnected(!!token);

    // Add scroll listener for header shadow
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setHeaderShadow(true);
      } else {
        setHeaderShadow(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    // Cleanup listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMedecins = async () => {
      setLoading(true); // Ensure loading is true at the start
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
    const fetchDepartements = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/departements/');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des départements');
        }
        const data = await response.json();
        console.log("Départements chargés :", data);
        setDepartements(data);
      } catch (error) {
        console.error("Erreur lors du chargement des départements :", error);
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
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
  }, [isAutoPlaying, heroes.length]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsConnected(false);
    window.location.href = '/'; // Consider using router.push('/') for Next.js navigation
  };

  // Afficher seulement les 3 premiers médecins
  const medecinsLimites = medecins.slice(0, 3);

  const handlePrevHero = () => {
    setIsAutoPlaying(false);
    setCurrentHero((prev) => (prev - 1 + heroes.length) % heroes.length);
  };

  const handleNextHero = () => {
    setIsAutoPlaying(false);
    setCurrentHero((prev) => (prev + 1) % heroes.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête - Sticky with dynamic shadow */}
     

      {/* Section Hero - Carousel */}
      <section className="hero-section h-[600px] relative overflow-hidden w-full">
        {heroes.map((hero, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentHero ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${hero.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%'
            }}
          >
            <div className="hero-content container mx-auto px-4 h-full flex flex-col justify-center items-start max-w-7xl">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
                {hero.title}
              </h2>
              <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl animate-fade-in-up">
                {hero.description}
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-up">
                {hero.buttons.map((button, btnIndex) => (
                  <Button
                    key={btnIndex}
                    onClick={button.onClick}
                    className={`${button.className} px-8 py-3 text-lg rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-xl`}
                  >
                    {button.text}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-10">
          <button
            onClick={handlePrevHero}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex gap-2">
            {heroes.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentHero(index);
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentHero ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNextHero}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Section Médecins - Improved card styling and animations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"> {/* Responsive flex direction and gap */} 
            <div>
              <h2 className="text-3xl font-bold text-blue-600">Nos Médecins</h2>
              <p className="text-gray-600 mt-2">Découvrez notre équipe médicale d'experts.</p> {/* Slightly improved text */} 
            </div>
            <Button 
              onClick={() => router.push('/auth/medecins/liste')} // Corrected route? Assuming /liste is the list page
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105 self-start md:self-center" // Align button
            >
              Voir tous les médecins
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              {/* Improved Spinner - Example using Tailwind classes */}
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-12">
              {/* Slightly improved error card styling */}
              <Card className="w-full max-w-md border-red-200 bg-red-50 shadow-md">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Erreur de chargement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700">{error}</p>
                  <p className="text-sm text-red-500 mt-2">Impossible de récupérer la liste des médecins. Veuillez réessayer plus tard.</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {medecinsLimites.map((medecin: any, index: number) => (
                <Card
                  key={medecin.id}
                  // Added hover scale and slight animation delay based on index
                  className={`w-full max-w-sm mx-auto shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105 animate-fade-in-up`} 
                  style={{ animationDelay: `${index * 100}ms` }} // Staggered animation
                >
                  <CardHeader className="flex flex-col items-center pt-6 pb-4 bg-gradient-to-b from-blue-50 to-white">
                    <Image
                      src={medecin.photo_url || '/images/default-avatar.png'} // Added fallback image
                      alt={`Photo de ${medecin.nom}`}
                      width={100} // Slightly larger image
                      height={100}
                      className="rounded-full border-4 border-white shadow-md mb-3 object-cover" // Ensure image covers space
                    />
                    <CardTitle className="text-lg font-semibold text-blue-800 text-center">
                    {medecin.nom} {/* Added Dr. prefix */} 
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{medecin.grade}</p>
                  </CardHeader>
                  <CardContent className="p-4 flex flex-col items-center"> {/* Centered content */} 
                    {/* Consider adding specialization if available */}
                    {/* <p className="text-center text-gray-600 text-sm mb-4">{medecin.specialization || 'Médecine Générale'}</p> */}
                    <Button
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:scale-105"
                      onClick={() => router.push(`/auth/medecins/${medecin.id}`)} // Ensure this route exists
                    >
                      Voir le profil
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section Départements - Improved card styling and animations */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white"> {/* Subtle gradient background */} 
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"> {/* Responsive flex direction and gap */} 
            <div>
              <h2 className="text-3xl font-bold text-blue-600">Nos Départements</h2>
              <p className="text-gray-600 mt-2">Explorez nos services médicaux spécialisés.</p> {/* Slightly improved text */} 
            </div>
            <Button 
              onClick={() => router.push('/departements')} // Assuming this route exists
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105 self-start md:self-center" // Align button
            >
              Voir tous les départements
            </Button>
          </div>

          {/* Consider adding loading/error state for departements similar to medecins */}
          {departements.length === 0 && !loading && !error && (
            <p className="text-center text-gray-500 py-12">Aucun département à afficher pour le moment.</p>
          )}
          {departements.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {departements.map((departement: any, index: number) => (
                <Card 
                  key={departement.id} 
                  className="hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer rounded-xl overflow-hidden border border-transparent hover:border-blue-200 hover:scale-[1.02] animate-fade-in-up" // Added hover border and scale
                  onClick={() => router.push(`/departements/${departement.id}`)} // Assuming this route exists
                  style={{ animationDelay: `${index * 100 + 500}ms` }} // Staggered animation (later than doctors)
                >
                  <CardHeader className="bg-blue-50 p-4">
                    <CardTitle className="text-xl font-semibold text-blue-800">
                      {departement.nom_depart}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-600 mb-4 line-clamp-3"> {/* Added line-clamp */} 
                      {departement.description || "Découvrez les services offerts par ce département."} {/* Improved placeholder */} 
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto pt-2"> {/* Pushed badges to bottom */} 
                      {departement.classe_pred && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
                          {departement.classe_pred}
                        </Badge>
                      )}
                      {/* Removed redundant badge with departement name */}
                      {/* <Badge variant="outline" className="text-blue-600">
                        {departement.nom_depart}
                      </Badge> */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer can also be improved if needed */}
      {/* <Footer /> */}
    </div>
  );
}

