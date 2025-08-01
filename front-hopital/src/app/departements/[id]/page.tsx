"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Medecin = {
  id: number;
  nom: string;
  email: string;
  grade: string;
  specialite: string;
  photo_url: string;
};

type Departement = {
  id: number;
  nom_depart: string;
  description: string;
};

export default function DepartementDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [departement, setDepartement] = useState<Departement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Récupérer médecins
    fetch(`http://localhost:5000/api/medecins?departement_id=${id}`)
      .then((res) => res.json())
      .then(setMedecins);

    // Récupérer infos du département
    fetch(`http://localhost:5000/api/departements/${id}`)
      .then((res) => res.json())
      .then(setDepartement)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-500 to-blue-700 py-20 px-6 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {departement?.nom_depart ?? "Département"}
              </h1>
              {departement?.description && (
                <p className="text-xl text-blue-100 max-w-2xl">
                  {departement.description}
                </p>
              )}
            </div>
            <Button 
              variant="outline" 
              className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
              onClick={() => router.push("/departements")}
            >
              ⬅ Retour aux départements
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto py-12 px-6">
        {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : medecins.length === 0 ? (
        <p className="text-red-500">Aucun médecin dans ce département.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medecins.map((m) => (
            <Link
              key={m.id}
              href={`/auth/medecins/${m.id}`}
              className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
            >
              <div className="overflow-hidden rounded-lg mb-4">
                <img
                  src={(m.photo_url || "/placeholder-doctor.jpg").trim()}
                  alt={m.nom}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {m.nom}
                </h2>
                <p className="text-blue-600 font-medium">{m.specialite}</p>
                <div className="flex items-center text-gray-500 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {m.email}
                </div>
                <p className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">
                  {m.grade}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
