'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


type Medecin = {
  id: number;
  nom: string;
  specialite: string;
};

export default function MedecinCard({ medecin }: { medecin: Medecin }) {
  return (
    <Card className="text-center w-64">
      <CardHeader>
        <CardTitle>{medecin.nom}</CardTitle>
        <p className="text-sm text-muted">{medecin.specialite}</p>
      </CardHeader>
      <CardContent>
        <Button onClick={() => window.location.href = `/medecins/${medecin.id}`}>
          Voir Profil
        </Button>
      </CardContent>
    </Card>
  );
}
