"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type Departement = {
  id: number;
  nom_depart: string;
  description: string;
};

export default function DepartementsPage() {
  const [departements, setDepartements] = useState<Departement[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5000/api/departements")
      .then((res) => res.json())
      .then((data) => setDepartements(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nos Départements</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departements.map((dep) => (
          <Card
            key={dep.id}
            className="p-6 hover:shadow-lg cursor-pointer"
            onClick={() => router.push(`/departements/${dep.id}`)}
          >
            <h2 className="text-xl font-semibold text-blue-700">{dep.nom_depart}</h2>
            <p className="text-gray-600 mt-2">{dep.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
