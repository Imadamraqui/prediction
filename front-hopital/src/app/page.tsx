'use client'

import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 🔹 Section Hero avec une image */}
      <section
  className="relative w-full h-[80vh] bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('/images/house.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
  {/* Overlay */}
 
</section>




      {/* 🔸 Section Médecins */}
      <section id="medecins" className="h-screen bg-blue-50 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-12">👩‍⚕️ Médecins disponibles</h2>
        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="bg-white shadow rounded-xl p-6 w-64 text-center">
              <h3 className="font-semibold text-lg">Dr. Amina Rami</h3>
              <p className="text-sm text-gray-500">Cardiologue</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Voir profil
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 🔸 Section Départements */}
      <section id="departements" className="h-screen bg-green-50 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold text-green-900 mb-12">🏥 Départements</h2>
        <div className="flex gap-6 flex-wrap justify-center">
          {['Cardiologie', 'Pédiatrie', 'Neurologie', 'Oncologie'].map(dep => (
            <div
              key={dep}
              className="bg-green-200 text-green-900 px-6 py-3 rounded-full font-semibold shadow"
            >
              {dep}
            </div>
          ))}
        </div>
      </section>

      {/* 🔸 Section Fonctionnalités */}
      <section id="fonctionnalites" className="h-screen bg-yellow-50 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold text-yellow-900 mb-12">⚙️ Nos fonctionnalités</h2>
        <div className="grid grid-cols-3 gap-8 max-w-6xl text-center">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-bold text-yellow-800">Prédictions intelligentes</h3>
            <p>Analyse vos données pour prédire vos risques de santé.</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-bold text-yellow-800">Recommandations personnalisées</h3>
            <p>Des conseils adaptés à votre profil.</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-bold text-yellow-800">Interface intuitive</h3>
            <p>Navigation fluide, tableau de bord simplifié.</p>
          </div>
        </div>
      </section>

      {/* 🔹 Section "Qui sommes-nous" */}
      <section id="about" className="h-screen bg-purple-50 flex flex-col items-center justify-center text-center px-8">
        <h2 className="text-4xl font-bold text-purple-900 mb-8">À propos de nous</h2>
        <p className="max-w-3xl text-gray-700 text-lg">
          Santé+ est une plateforme dédiée à la santé connectée. Nous mettons en relation les patients et les professionnels
          de santé tout en offrant des prédictions intelligentes et des recommandations personnalisées.
        </p>
      </section>

      
    </div>
  )
}
