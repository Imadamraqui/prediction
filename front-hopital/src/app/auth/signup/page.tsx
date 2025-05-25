'use client';
import { useState } from 'react';

export default function SignupPage() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [mot_de_passe, setPassword] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [sexe, setSexe] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom,
          email,
          mot_de_passe,
          date_naissance: dateNaissance,
          sexe
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Inscription réussie ! Vous pouvez vous connecter.');
      } else {
        setMessage(`❌ ${data.message || "Erreur lors de l'inscription."}`);
      }
    } catch (error) {
      console.error('Erreur lors de l'inscription :', error);
      setMessage('❌ Erreur serveur. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-green-600">
          Inscription utilisateur
        </h2>

        {message && (
          <div
            className={`mb-4 text-center text-sm ${
              message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </div>
        )}

        <label className="block mb-4">
          <span className="text-gray-700">Nom</span>
          <input
            type="text"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-green-500"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Mot de passe</span>
          <input
            type="password"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-green-500"
            value={mot_de_passe}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Date de naissance</span>
          <input
            type="date"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-green-500"
            value={dateNaissance}
            onChange={(e) => setDateNaissance(e.target.value)}
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700">Sexe</span>
          <select
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-green-500"
            value={sexe}
            onChange={(e) => setSexe(e.target.value)}
            required
          >
            <option value="">-- Sélectionner --</option>
            <option value="H">Homme</option>
            <option value="F">Femme</option>
            <option value="Autre">Autre</option>
          </select>
        </label>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-all duration-200"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}
