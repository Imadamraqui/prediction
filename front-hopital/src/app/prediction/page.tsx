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
    recommendations: string[]
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
      console.log('Envoi de la requête au serveur...')
      const response = await fetch('http://localhost:5000/predict/', {
        method: 'POST',
        body: formData,
      })

      console.log('Statut de la réponse:', response.status)
      console.log('Headers de la réponse:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          console.error('Données d\'erreur du serveur:', errorData)
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (e) {
          console.error('Erreur lors de la lecture de la réponse:', e)
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('Données reçues du serveur:', data)
      
      // Vérifier si la réponse contient les données attendues
      if (!data.prediction || !data.recommendations) {
        console.error('Format de réponse invalide:', data)
        throw new Error('Format de réponse invalide du serveur')
      }

      setResult({
        prediction: data.prediction,
        recommendations: data.recommendations
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Prédiction de Santé
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <p className="mt-2 text-sm">
                Vérifiez que :
                <ul className="list-disc list-inside mt-1">
                  <li>Le serveur backend est en cours d'exécution sur http://localhost:5000</li>
                  <li>Le fichier est au format CSV ou PDF valide</li>
                  <li>Le fichier contient les données requises</li>
                </ul>
              </p>
              <p className="mt-2 text-sm">
                Pour plus de détails, ouvrez la console du navigateur (F12) et regardez les messages d'erreur.
              </p>
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Résultat :
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {result.prediction}
                </span>
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
