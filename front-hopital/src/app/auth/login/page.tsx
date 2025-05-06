'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [mot_de_passe, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mot_de_passe }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Connexion établie avec succès !");
        console.log(data); // Token, message, etc.
        localStorage.setItem('token', data.token);
        setMessage('✅ Connexion réussie !');
        // TODO : rediriger vers /dashboard ou sauvegarder le token localStorage
      } else {
        setMessage('❌ Identifiants incorrects');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setMessage('❌ Erreur serveur. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md animate-fade-in"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Connexion utilisateur
        </h2>

        {message && (
          <div
            className={`mb-4 text-center text-sm ${
              message.startsWith('✅')
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {message}
          </div>
        )}

        <label className="block mb-4">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700">Mot de passe</span>
          <input
            type="password"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            value={mot_de_passe}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all duration-200"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
