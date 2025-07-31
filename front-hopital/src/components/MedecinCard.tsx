'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type Medecin = {
  id: number;
  nom: string;
  specialite: string;
  photo_url: string;
};

export default function MedecinCard({ medecin }: { medecin: Medecin }) {
  return (
    <Card className="text-center w-64">
      <CardHeader>
        <div className="w-32 h-32 mx-auto mb-4 relative">
          <Image 
            src={(medecin.photo_url || '/default-doctor.png').trim()} 
            alt={medecin.nom}
            fill
            className="object-cover rounded-full"
            sizes="(max-width: 128px) 100vw, 128px"
          />
        </div>
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
