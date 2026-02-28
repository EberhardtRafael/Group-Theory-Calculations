import axios, { type AxiosResponse } from 'axios';
import type {
  GroupCreate,
  GroupResponse,
  LieAlgebraInfo,
  RootSystemData,
  DynkinDiagram,
  IrrepCreate,
  IrrepResponse,
  TensorProductRequest,
  TensorProductResponse,
  WeightSystemVisualizationRequest,
  WeightSystemVisualizationResponse,
  CalculationSubmit,
  CalculationStatus,
  GroupListItem,
} from '../types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API methods
export const api = {
  // ============================================================================
  // Groups API
  // ============================================================================

  /**
   * Create a new Lie group and get its properties
   */
  createGroup: (
    name: string,
    notation: 'cartan' | 'physicist' = 'cartan'
  ): Promise<AxiosResponse<GroupResponse>> =>
    apiClient.post<GroupResponse>('/groups/create', { name, notation }),

  /**
   * Get group details by name (e.g., 'SU3', 'A2', 'E6')
   */
  getGroup: (groupName: string): Promise<AxiosResponse<GroupResponse>> =>
    apiClient.get<GroupResponse>(`/groups/${groupName}`),

  /**
   * List all available groups
   */
  listGroups: (skip = 0, limit = 100): Promise<AxiosResponse<GroupListItem[]>> =>
    apiClient.get<GroupListItem[]>('/groups/', { params: { skip, limit } }),

  /**
   * Get detailed algebra information for a group
   */
  getGroupInfo: (groupName: string): Promise<AxiosResponse<LieAlgebraInfo>> =>
    apiClient.get<LieAlgebraInfo>(`/groups/${groupName}/info`),

  /**
   * Get complete root system data for a group
   */
  getRootSystem: (groupName: string): Promise<AxiosResponse<RootSystemData>> =>
    apiClient.get<RootSystemData>(`/groups/${groupName}/root-system`),

  /**
   * Get Dynkin diagram representation for a group
   */
  getDynkinDiagram: (groupName: string): Promise<AxiosResponse<DynkinDiagram>> =>
    apiClient.get<DynkinDiagram>(`/groups/${groupName}/dynkin-diagram`),

  /**
   * Break symmetry by crossing out a Dynkin diagram node
   */
  breakSymmetry: (groupId: string, nodeIndex: number, method = 'standard') =>
    apiClient.post(`/groups/${groupId}/break-symmetry`, { node_index: nodeIndex, method }),

  // ============================================================================
  // Irreps API
  // ============================================================================

  /**
   * Create an irreducible representation from highest weight
   */
  createIrrep: (data: IrrepCreate): Promise<AxiosResponse<IrrepResponse>> =>
    apiClient.post<IrrepResponse>('/irreps/', data),

  /**
   * Get irrep details by ID
   */
  getIrrep: (irrepId: string): Promise<AxiosResponse<IrrepResponse>> =>
    apiClient.get<IrrepResponse>(`/irreps/${irrepId}`),

  /**
   * List irreps, optionally filtered by group
   */
  listIrreps: (groupId?: string, skip = 0, limit = 100): Promise<AxiosResponse<IrrepResponse[]>> =>
    apiClient.get<IrrepResponse[]>('/irreps/', {
      params: { group_id: groupId, skip, limit },
    }),

  /**
   * Calculate tensor product decomposition
   */
  calculateTensorProduct: (
    data: TensorProductRequest
  ): Promise<AxiosResponse<TensorProductResponse>> =>
    apiClient.post<TensorProductResponse>('/irreps/tensor-product', data),

  /**
   * Get weight system for multiplet diagram visualization
   */
  getWeightSystemVisualization: (
    data: WeightSystemVisualizationRequest
  ): Promise<AxiosResponse<WeightSystemVisualizationResponse>> =>
    apiClient.post<WeightSystemVisualizationResponse>('/irreps/weight-system', data),

  // ============================================================================
  // Calculations API (for async heavy computations)
  // ============================================================================

  /**
   * Submit a heavy calculation for async processing
   */
  submitCalculation: (
    operation: string,
    parameters: Record<string, unknown>
  ): Promise<AxiosResponse<CalculationStatus>> =>
    apiClient.post<CalculationStatus>('/calculations/submit', { operation, parameters }),

  /**
   * Get status of a submitted calculation
   */
  getCalculationStatus: (taskId: string): Promise<AxiosResponse<CalculationStatus>> =>
    apiClient.get<CalculationStatus>(`/calculations/${taskId}/status`),

  /**
   * Cancel a running calculation
   */
  cancelCalculation: (taskId: string): Promise<AxiosResponse<void>> =>
    apiClient.delete<void>(`/calculations/${taskId}`),
};
