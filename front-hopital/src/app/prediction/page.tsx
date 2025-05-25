'use client'

import { useState } from 'react'

// Mapping des numéros vers les noms de maladies
const HEALTH_CLASSES = {
  "0": "Diabetes",
  "1": "Heart Di",
  "2": "Healthy",
  "3": "Thalasse",
  "4": "Anemia",
  "5": "Thromboc"
}

export default function PredictionPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    prediction: string
    probabilities: { [key: string]: number }
    recommendations: string[]
    medecins_and_departement: {
      departement: {
        id: number
        nom_depart: string
        description: string
      }
      medecins: Array<{
        id: number
        nom: string
        grade: string
        specialite: string
        photo_url: string
      }>
    } | null
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop()?.toLowerCase()
      if (fileType !== 'csv' && fileType !== 'pdf') {
        setError('Veuillez sélectionner un fichier CSV ou PDF')
        setFile(null)
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:5000/api/prediction/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (e) {
          console.error('Erreur lors de la lecture de la réponse:', e)
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      if (!data.prediction || !data.recommendations || !data.probabilities) {
        throw new Error('Format de réponse invalide du serveur')
      }

      setResult({
        prediction: data.prediction,
        probabilities: data.probabilities,
        recommendations: data.recommendations,
        medecins_and_departement: data.medecins_and_departement
      })
    } catch (err) {
      console.error('Erreur complète:', err)
      let errorMessage = 'Une erreur est survenue lors de la communication avec le serveur'
      
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le serveur backend est en cours d\'exécution sur http://localhost:5000'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Prédiction de Santé
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionnez votre fichier (CSV ou PDF)
              </label>
              <input
                type="file"
                accept=".csv,.pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-500">
                  Fichier sélectionné : {file.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!file || loading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium
                ${!file || loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {loading ? 'Analyse en cours...' : 'Analyser'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md">
              <p className="font-medium">Erreur :</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Résultat principal :
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {result.prediction}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Probabilités pour chaque maladie :
                </h3>
                <div className="space-y-2">
                  {Object.entries(result.probabilities)
                    .sort(([, a], [, b]) => b - a) // Trier par probabilité décroissante
                    .map(([maladie, proba]) => (
                      <div 
                        key={maladie} 
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          maladie === result.prediction 
                            ? 'bg-blue-50 border-2 border-blue-200' 
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${
                            maladie === result.prediction 
                              ? 'text-blue-700' 
                              : 'text-gray-700'
                          }`}>
                            {maladie}
                            {maladie === result.prediction && (
                              <span className="ml-2 text-xs text-blue-500">(Prédiction principale)</span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-40 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                              className={`h-2.5 rounded-full ${
                                maladie === result.prediction 
                                  ? 'bg-blue-600' 
                                  : 'bg-gray-400'
                              }`}
                              style={{ width: `${proba}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-medium ${
                            maladie === result.prediction 
                              ? 'text-blue-700' 
                              : 'text-gray-700'
                          }`}>
                            {proba.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Recommandations :
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {result.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>

              {result.medecins_and_departement && (
                <>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Département Recommandé :
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-xl font-medium text-blue-800 mb-2">
                        {result.medecins_and_departement.departement.nom_depart}
                      </h4>
                      <p className="text-gray-600">
                        {result.medecins_and_departement.departement.description}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Médecins Spécialistes Recommandés :
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {result.medecins_and_departement.medecins.map((medecin) => (
                        <div key={medecin.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-col items-center text-center">
                            <img
                              src={medecin.photo_url}
                              alt={medecin.nom}
                              className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-blue-100"
                            />
                            <h4 className="font-medium text-gray-900">{medecin.nom}</h4>
                            <p className="text-sm text-blue-600">{medecin.grade}</p>
                            <p className="text-sm text-gray-500 mt-1">{medecin.specialite}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
