import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// API methods
export const api = {
  // Groups
  createGroup: (name: string, notation: string = 'cartan') =>
    apiClient.post('/groups/create', { name, notation }),

  getGroup: (groupId: string) =>
    apiClient.get(`/groups/${groupId}`),

  breakSymmetry: (groupId: string, nodeIndex: number, method: string = 'standard') =>
    apiClient.post(`/groups/${groupId}/break-symmetry`, { node_index: nodeIndex, method }),

  // Irreps
  calculateTensorProduct: (group: string, irrep1: number[], irrep2: number[]) =>
    apiClient.post('/irreps/tensor-product', { group, irrep1, irrep2 }),

  createIrrep: (groupId: string, highestWeight: number[], method: string = 'weyl_reflection') =>
    apiClient.post('/irreps/', { group_id: groupId, highest_weight: highestWeight, method }),

  // Calculations
  submitCalculation: (operation: string, parameters: any) =>
    apiClient.post('/calculations/submit', { operation, parameters }),

  getCalculationStatus: (taskId: string) =>
    apiClient.get(`/calculations/${taskId}/status`),
}
