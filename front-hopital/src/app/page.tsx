
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
    // Fetch departements - consider adding loading/error state similar to medecins if needed
    fetch("http://localhost:5000/api/departements")
      .then((res) => res.json())
      .then((data) => {
        console.log("Départements chargés :", data);
        setDepartements(data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des départements :", error);
        // Optionally set an error state for departements
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsConnected(false);
    window.location.href = '/'; // Consider using router.push('/') for Next.js navigation
  };

  // Afficher seulement les 3 premiers médecins
  const medecinsLimites = medecins.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête - Sticky with dynamic shadow */}
     

      {/* Section Hero - Improved styling and animations */}
      <section className="hero-section h-[600px] overflow-hidden"> {/* Added overflow-hidden */} 
        <div className="hero-content container mx-auto px-4 h-full flex flex-col justify-center items-start"> {/* Align items start */} 
          {/* Added animation classes (requires tw-animate-css or similar setup in globals/tailwind.config) */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up animate-delay-300">
            Bienvenue à l'Hôpital Digital
          </h2>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl animate-fade-in-up animate-delay-500">
            Des soins de qualité pour votre santé, avec une équipe médicale professionnelle à votre service.
          </p>
          <div className="flex gap-4 animate-fade-in-up animate-delay-700">
            <Button 
              onClick={() => router.push('/auth/login')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Prendre rendez-vous
            </Button>
            <Button 
              onClick={() => router.push('/auth/signup')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg rounded-lg transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-xl"
            >
              S'inscrire
            </Button>
          </div>
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

