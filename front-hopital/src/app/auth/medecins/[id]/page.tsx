"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, use } from "react";

type Medecin = {
  id: number;
  nom: string;
  grade: string;
  email: string;
  photo_url: string;
  specialite?: string;
  telephone?: string;
};

function getSpecialiteDescription(specialite?: string) {
  switch (specialite) {
    case "Cardiologie":
      return "Spécialiste du cœur et des vaisseaux sanguins.";
    case "Pédiatrie":
      return "Spécialiste de la santé des enfants et des adolescents.";
    case "Stomatologie":
      return "Spécialiste de la bouche, des dents et des mâchoires.";
    case "Endocrinologie":
      return "Spécialiste des maladies hormonales et des glandes endocrines.";
    default:
      return "Spécialité médicale.";
  }
}

export default function MedecinDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [medecin, setMedecin] = useState<Medecin | null>(null);
  const [showSpecialite, setShowSpecialite] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/medecins/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Erreur de réponse");
        return res.json();
      })
      .then(setMedecin)
      .catch(() => notFound());
  }, [id]);

  if (!medecin) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-white to-blue-200 px-4 py-12">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Informations côté gauche */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <div className="mb-6">
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              {medecin.grade}
            </span>
            {medecin.specialite && (
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold ml-2">
                {medecin.specialite}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
            {medecin.nom}
          </h1>

          <p className="text-gray-600 mb-6">
            Nous vous proposons les meilleurs soins médicaux adaptés à vos besoins.
          </p>

          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-700 mb-1">Email</h2>
            <p className="text-gray-600 mb-2">{medecin.email}</p>

            {medecin.telephone && (
              <>
                <h2 className="text-base font-semibold text-gray-700 mt-3 mb-1">Téléphone</h2>
                <p className="text-gray-600">{medecin.telephone}</p>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            {medecin.email && (
              <a
                href={`mailto:${medecin.email}`}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow transition"
              >
                Contacter par email
              </a>
            )}

            {medecin.telephone && (
              <a
                href={`tel:${medecin.telephone}`}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full shadow transition"
              >
                Appeler
              </a>
            )}

            {!showSpecialite ? (
              <button
                onClick={() => setShowSpecialite(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-full shadow transition"
              >
                Voir spécialité
              </button>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-4 shadow transition w-full">
                <div className="font-semibold text-green-700">
                  {medecin.specialite || "Aucune spécialité renseignée"}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {getSpecialiteDescription(medecin.specialite)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Photo côté droit */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-tr from-blue-100 to-green-100 p-8">
          <div className="relative w-64 h-64 rounded-full border-8 border-white shadow-xl overflow-hidden">
            <Image
              src={medecin.photo_url || "/default-doctor.png"}
              alt={`Photo de ${medecin.nom}`}
              fill
              className="object-cover"
              sizes="256px"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
