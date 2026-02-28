/**
 * TypeScript types for Group Theory Calculator API
 *
 * These types match the backend Pydantic models to ensure type safety
 * between frontend and backend.
 */

// ============================================================================
// Group Types
// ============================================================================

export interface GroupCreate {
  name: string;
  notation?: 'cartan' | 'physicist';
}

export interface GroupResponse {
  id: string;
  name: string;
  cartan_name: string;
  rank: number;
  cartan_matrix: number[][];
  simple_roots: number[][];
  dimension: number;
  positive_roots?: number[][];
}

export interface LieAlgebraInfo {
  cartan_type: string;
  physics_name: string;
  rank: number;
  dimension: number;
  num_roots: number;
  num_positive_roots: number;
}

export interface RootSystemData {
  simple_roots: number[][];
  positive_roots: number[][];
  cartan_matrix: number[][];
}

export interface DynkinDiagram {
  diagram_string: string;
  vertices: number[];
  edges: Array<{
    from: number;
    to: number;
    type: number;
  }>;
  node_labels: string[];
  cartan_type: string;
}

// ============================================================================
// Irrep Types
// ============================================================================

export interface IrrepCreate {
  group_id: string;
  highest_weight: number[];
  method?: 'weyl_reflection' | 'freudenthal';
}

export interface IrrepResponse {
  id: string;
  group_id: string;
  highest_weight: number[];
  dimension: number;
  weights: number[][];
  multiplicities: number[];
  latex_name: string;
}

export interface TensorProductRequest {
  group: string;
  irrep1: number[];
  irrep2: number[];
}

export interface TensorProductResult {
  weight: number[];
  multiplicity: number;
  dimension: number;
  latex_name: string;
}

export interface TensorProductResponse {
  decomposition: TensorProductResult[];
  latex: string;
  // Helper fields for UI (enriched client-side)
  result_irreps?: TensorProductResult[];
  latex_formula?: string;
  multiplicities?: Record<string, number>;
}

// ============================================================================
// Weight System & Multiplet Diagram Types
// ============================================================================

export interface WeightPoint {
  i3: number;
  y: number;
  h1: number;
  h2: number;
  multiplicity: number;
}

export interface WeightSystemVisualizationRequest {
  group: string;
  irrep: number[];
}

export interface WeightSystemVisualizationResponse {
  group: string;
  dynkin_labels: number[];
  dimension: number;
  num_weights: number;
  weights: WeightPoint[];
  coordinate_system: string;
}

// ============================================================================
// Calculation Types
// ============================================================================

export interface CalculationSubmit {
  operation: string;
  parameters: Record<string, unknown>;
}

export interface CalculationStatus {
  task_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: Record<string, unknown>;
  error?: string;
  created_at: string;
  completed_at?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiError {
  detail: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

// ============================================================================
// Helper Types
// ============================================================================

export type SupportedGroup =
  | 'SU3'
  | 'SU(3)'
  | 'SU5'
  | 'SU(5)'
  | 'SO10'
  | 'SO(10)'
  | 'E6'
  | 'E7'
  | 'E8';
export type CartanType = 'A2' | 'A4' | 'D5' | 'E6' | 'E7' | 'E8';

export interface GroupListItem {
  cartan_type: CartanType;
  physics_name: string;
  rank: number;
}
