'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Prediction = {
  id: number
  prediction: string
  probabilities: { [key: string]: number }
  recommendations: string[]
  departement: {
    id: number
    nom_depart: string
    description: string
  }
  date_prediction: string
}

type PatientInfo = {
  nom: string
  email: string
  date_naissance: string
  sexe: string
}

export default function DashboardPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        console.log('Token from localStorage:', token)
        
        if (!token) {
          console.log('No token found, redirecting to login')
          router.push('/auth/login')
          return
        }

        // Récupérer les informations du patient
        console.log('Fetching profile with token:', token)
        const response = await fetch('http://localhost:5000/api/patient/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        console.log('Profile response status:', response.status)
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Profile error:', errorData)
          throw new Error('Erreur lors de la récupération du profil')
        }
        const patientData = await response.json()
        console.log('Profile data:', patientData)
        setPatientInfo(patientData)

        // Récupérer l'historique des prédictions
        const predictionsResponse = await fetch('http://localhost:5000/api/predictions/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!predictionsResponse.ok) throw new Error('Erreur lors de la récupération des prédictions')
        const predictionsData = await predictionsResponse.json()
        
        // Traiter les données des prédictions
        const processedPredictions = predictionsData.map((pred: any) => ({
          ...pred,
          probabilities: typeof pred.probabilities === 'string' ? JSON.parse(pred.probabilities) : pred.probabilities,
          recommendations: typeof pred.recommendations === 'string' ? JSON.parse(pred.recommendations) : pred.recommendations
        }))
        
        console.log('Predictions traitées:', processedPredictions)
        setPredictions(processedPredictions)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-500">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête du dashboard */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bienvenue, {patientInfo?.nom}
              </h1>
              <p className="text-gray-600 mt-1">
                Voici votre tableau de bord personnel
              </p>
            </div>
            <Button
              onClick={() => router.push('/prediction')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Nouvelle Prédiction
            </Button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total des Prédictions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{predictions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dernière Prédiction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {predictions[0]?.prediction || 'Aucune'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Département Principal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {predictions[0]?.departement.nom_depart || 'Aucun'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Historique des prédictions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Historique des Prédictions
          </h2>
          <div className="space-y-6">
            {predictions.map((pred) => (
              <Card key={pred.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {pred.prediction}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(pred.date_prediction).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {pred.departement.nom_depart}
                    </ Badge>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Probabilités :
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(pred.probabilities)
                        .sort(([, a], [, b]) => {
                          const numA = typeof a === 'string' ? parseFloat(a) : Number(a);
                          const numB = typeof b === 'string' ? parseFloat(b) : Number(b);
                          return numB - numA;
                        })
                        .map(([maladie, proba]) => {
                          const probaNum = typeof proba === 'string' ? parseFloat(proba) : Number(proba);
                          if (isNaN(probaNum)) {
                            console.error(`Probabilité invalide pour ${maladie}:`, proba);
                            return null;
                          }
                          return (
                            <div key={maladie} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{maladie}</span>
                              <div className="flex items-center">
                                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${probaNum}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600">
                                  {probaNum.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Recommandations :
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {Array.isArray(pred.recommendations) ? (
                        pred.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))
                      ) : (
                        <li>Pas de recommandations disponibles</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}

            {predictions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Vous n'avez pas encore de prédictions. Commencez par faire une nouvelle prédiction !
                </p>
                <Button
                  onClick={() => router.push('/prediction')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Faire une Prédiction
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 