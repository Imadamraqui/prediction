'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';  
import { useEffect } from 'react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [mot_de_passe, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mot_de_passe }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage('Connexion réussie');
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Partie gauche avec l'image */}
      <div className="hidden lg:block w-1/2 relative">
        <Image
          src="/images/heroPredict.png"
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-blue-900/50 flex items-center justify-center">
          <div className="text-white text-center p-8">
            <h1 className="text-4xl font-bold mb-4">Bienvenue à l'Hôpital Digital</h1>
            <p className="text-xl">Connectez-vous pour accéder à vos services médicaux</p>
          </div>
        </div>
      </div>

      {/* Partie droite avec le formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6 animate-fade-in"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-2">Connexion</h2>
            <p className="text-gray-600">Accédez à votre espace personnel</p>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-center ${
              message.startsWith('✅') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={mot_de_passe}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>

          <p className="text-center text-gray-600 mt-4">
            Pas encore de compte ?{' '}
            <a href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              S'inscrire
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
