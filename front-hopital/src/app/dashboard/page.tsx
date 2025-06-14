'use client'

import { useEffect, useState } from 'react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer
} from 'recharts'

interface PredictionHistory {
  date: string
  result: string
  probabilities: any
  recommendations: string[]
  departement: string
}

interface DepartmentStats {
  departement: string
  total_predictions: number
}

export default function Dashboard() {
  const [predictionHistory, setPredictionHistory] = useState<PredictionHistory[]>([])
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('Vous devez être connecté pour voir le tableau de bord')
          return
        }

        const headers = {
          'Authorization': `Bearer ${token}`
        }

        const [historyRes, departmentsRes] = await Promise.all([
          fetch('http://localhost:5000/api/stats/predictions/history', { headers }),
          fetch('http://localhost:5000/api/stats/departements', { headers })
        ])

        if (!historyRes.ok || !departmentsRes.ok) {
          throw new Error('Erreur lors de la récupération des données')
        }

        const history = await historyRes.json()
        const departments = await departmentsRes.json()

        setPredictionHistory(history)
        setDepartmentStats(departments)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError(error instanceof Error ? error.message : 'Une erreur est survenue')
      }
    }

    fetchData()
  }, [])

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur : </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de Bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Historique des prédictions */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Historique des Prédictions</h2>
          <div className="h-[300px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Résultat</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {predictionHistory.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.result}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.departement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistiques des départements */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Statistiques par Département</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="departement" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_predictions" fill="#8884d8" name="Nombre de prédictions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
} 