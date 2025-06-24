"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { differenceInYears, parseISO } from "date-fns";

type Patient = {
  nom: string;
  email: string;
  sexe: string;
  date_naissance: string;
};

type Prediction = {
  id: number;
  prediction: string;
  date_prediction: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<Patient | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false); // ❗ pour éviter de rester bloqué en chargement
      return;
    }

    Promise.all([
      fetch("http://localhost:5000/api/patient/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((res) => res.ok ? res.json() : Promise.reject()),

      fetch("http://localhost:5000/api/predictions/pdf-historique", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((res) => res.ok ? res.json() : [])
    ])
      .then(([userData, predictionData]) => {
        setUser(userData);
        setPredictions(predictionData);
      })
      .catch(() => {
        setUser(null);
        setPredictions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Mon Profil</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : !user ? (
        <p className="text-red-500">Utilisateur non connecté ou profil introuvable.</p>
      ) : (
        <>
          <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-800 mb-1">
                Bonjour {user.nom} 👋
              </h2>
              <p className="text-sm text-gray-600">
                Âge : {differenceInYears(new Date(), parseISO(user.date_naissance))} ans
              </p>
              <p className="text-sm text-gray-600">
                Nombre de prédictions : {predictions.length}
              </p>
              {predictions[0] && (
                <p className="text-sm text-gray-600">
                  Dernière prédiction :{" "}
                  {new Date(predictions[0].date_prediction).toLocaleDateString()} (
                  {predictions[0].prediction})
                </p>
              )}
            </div>

            <button
              onClick={async () => {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await fetch("http://localhost:5000/api/pdf-gen", {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "historique_sante.pdf";
                document.body.appendChild(a);
                a.click();
                a.remove();
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <Download size={18} />
              Télécharger l’historique
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
            <p><strong>Nom :</strong> {user.nom}</p>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Sexe :</strong> {user.sexe}</p>
            <p><strong>Date de naissance :</strong> {user.date_naissance}</p>
          </div>
        </>
      )}
    </div>
  );
}
