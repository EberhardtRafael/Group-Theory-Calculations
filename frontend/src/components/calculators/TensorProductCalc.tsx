import { useState } from 'react'
import { api } from '@/services/api'

interface TensorProductCalcProps {
  group: string
}

export function TensorProductCalc({ group }: TensorProductCalcProps) {
  const [irrep1, setIrrep1] = useState<string>('[1,0]')
  const [irrep2, setIrrep2] = useState<string>('[1,0]')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const weight1 = JSON.parse(irrep1)
      const weight2 = JSON.parse(irrep2)
      
      const response = await api.calculateTensorProduct(group, weight1, weight2)
      setResult(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Calculation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Irrep
          </label>
          <input
            type="text"
            value={irrep1}
            onChange={(e) => setIrrep1(e.target.value)}
            placeholder="[1,0]"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Second Irrep
          </label>
          <input
            type="text"
            value={irrep2}
            onChange={(e) => setIrrep2(e.target.value)}
            placeholder="[1,0]"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {loading ? 'Calculating...' : 'Calculate Tensor Product'}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Result:</h3>
          <div className="font-mono text-sm mb-4">{result.latex}</div>
          
          <div className="space-y-2">
            {result.decomposition.map((term: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>Weight: {JSON.stringify(term.weight)}</span>
                <span>Dimension: {term.dimension}</span>
                <span className="font-semibold">{term.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
