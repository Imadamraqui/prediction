import { notFound } from "next/navigation";

type Medecin = {
  id: number;
  nom: string;
  grade: string;
  email: string;
  photo_url: string;
};

export default async function MedecinDetail({ params }: { params: { id: string } }) {
  try {
    const res = await fetch(`http://localhost:5000/api/medecins/${params.id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error("Erreur de réponse :", res.status);
      notFound();
    }

    const medecin: Medecin = await res.json();

    return (
      <div className="min-h-screen p-10 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold mb-4">{medecin.nom}</h1>
        <p className="text-lg text-gray-600 mb-2">{medecin.grade}</p>
        <p className="text-sm text-gray-500 mb-4">{medecin.email}</p>
        <img
          src={medecin.photo_url}
          alt={`Photo de ${medecin.nom}`}
          className="w-60 h-60 object-cover rounded-full border-4 border-blue-500"
        />
      </div>
    );
  } catch (error) {
    console.error("Erreur de récupération du médecin :", error);
    notFound(); // ou retourne une erreur personnalisée
  }
}
