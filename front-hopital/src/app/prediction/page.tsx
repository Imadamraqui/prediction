'use client'

import { useState } from 'react'

export default function PredictionPage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<{ prediction: string; recommendations: string[] } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setResult(null)
      setError(null)
    }
  }

  const handleSubmit = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:5000/predict/', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la prédiction')
      }

      const data = await response.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      setError('Erreur serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">🧪 Prédiction médicale</h1>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mb-6"
      >
        {loading ? 'Prédiction...' : 'Envoyer'}
      </button>

      {/* Erreur */}
      {error && (
        <div className="mb-4 text-red-600 font-semibold">
          {error}
        </div>
      )}

      {/* Résultat */}
      {result && (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Résultat : {result.prediction}
          </h2>

          {result.recommendations && result.recommendations.length > 0 ? (
            <div>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">Recommandations :</h3>
              <ul className="list-disc list-inside text-gray-700 text-left">
                {result.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500">Pas de recommandation disponible.</p>
          )}
        </div>
      )}
    </div>
  )
}
