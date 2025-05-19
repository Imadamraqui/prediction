'use client';
import { useEffect, useState } from "react";
import MedecinCard from '@/components/MedecinCard';

type Medecin = {
  id: number;
  nom: string;
  specialite: string;
};

export default function ListeMedecins() {
  const [medecins, setMedecins] = useState<Medecin[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/medecins")
      .then(res => res.json())
      .then(data => setMedecins(data));
  }, []);

  return (
    <div className="min-h-screen p-10">
      <h2 className="text-3xl font-bold mb-6">Médecins Disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {medecins.map(medecin => (
          <MedecinCard key={medecin.id} medecin={medecin} />
        ))}
      </div>
    </div>
  );
}
