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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">
          {departement?.nom_depart ?? "Département"}
        </h1>
        <Button variant="outline" onClick={() => router.push("/departements")}>
          ⬅ Retour aux départements
        </Button>
      </div>

      {departement?.description && (
        <p className="mb-6 text-gray-700">{departement.description}</p>
      )}

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
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition block"
            >
              <img
                src={m.photo_url || "/placeholder-doctor.jpg"}
                alt={m.nom}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h2 className="text-lg font-bold text-gray-800">{m.nom}</h2>
              <p className="text-sm text-gray-600">{m.specialite}</p>
              <p className="text-sm text-gray-500">{m.email}</p>
              <p className="text-sm text-blue-600 mt-1">{m.grade}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
