'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/services/api';
import type { WeightSystemVisualizationResponse } from '@/types/api';
import Alert from '../ui/Alert';
import MathComponent from '../ui/Math';

interface MultipletDiagramProps {
  group: string;
  irrep: number[];
  dimension?: '2d' | '3d';
}

// Internal display type for canvas rendering
interface WeightPoint {
  x: number;
  y: number;
  multiplicity?: number;
}

const MultipletDiagramRenderer = ({ group, irrep, dimension = '2d' }: MultipletDiagramProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [weights, setWeights] = useState<WeightPoint[]>([]);
  const [weightData, setWeightData] = useState<WeightSystemVisualizationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const fetchWeights = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Try backend API first
        const response = await api.getWeightSystemVisualization({
          group,
          irrep,
        });
        
        // Store full response data
        setWeightData(response.data);
        
        // Map from API coordinates (i3, y) to display coordinates (x, y)
        const weightPoints: WeightPoint[] = response.data.weights.map(w => ({
          x: w.i3,
          y: w.y,
          multiplicity: w.multiplicity,
        }));
        
        setWeights(weightPoints);
        setUseFallback(false);
      } catch (err) {
        console.warn('Backend weight calculation failed, using fallback:', err);
        // Fall back to hardcoded weights
        const fallbackWeights = generateWeightsForRepresentation(group, irrep);
        if (fallbackWeights) {
          setWeights(fallbackWeights);
          setUseFallback(true);
        } else {
          setError(`Weight generation not available for ${group} ${irrep.join(',')}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeights();
  }, [group, irrep]);

  useEffect(() => {
    if (!canvasRef.current || weights.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawWeightDiagram(ctx, weights, canvas.width, canvas.height);
  }, [weights]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-600">Calculating weight system...</div>
      </div>
    );
  }

  if (error && dimension === '3d') {
    return (
      <Alert variant="info">
        <strong>3D Multiplet Diagrams Coming Soon</strong>
        <p className="text-sm mt-1">
          3D visualization with Three.js will be implemented in Phase 2 of the roadmap.
        </p>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="warning">
        <strong>Weight System Not Available</strong>
        <p className="text-sm mt-1">{error}</p>
        <p className="text-sm mt-1">
          This representation may require additional backend implementation.
        </p>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Canvas Visualization */}
      <div className="flex flex-col items-center space-y-2">
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="border border-slate-300 rounded bg-white"
        />
        <div className="text-xs text-slate-500">
          {useFallback && (
            <span className="text-amber-600">(Using fallback calculation)</span>
          )}
        </div>
      </div>

      {/* Weight System Information & Table */}
      {weightData && (
        <div className="w-full lg:w-auto lg:min-w-[400px] lg:max-w-[500px] flex flex-col gap-4">
          {/* Weight System Summary */}
          <div className="bg-slate-50 p-4 rounded-lg space-y-3">
            <div className="text-lg font-semibold text-slate-900">Weight System Information</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-semibold text-slate-700">Group:</span>{' '}
                <MathComponent>{weightData.group}</MathComponent>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Dynkin Labels:</span>{' '}
                <MathComponent>{`[${weightData.dynkin_labels.join(',')}]`}</MathComponent>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Dimension:</span>{' '}
                <span className="text-slate-900">{weightData.dimension}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Unique Weights:</span>{' '}
                <span className="text-slate-900">{weightData.num_weights}</span>
              </div>
            </div>
          </div>

          {/* Weights Table */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="bg-slate-100 px-4 py-2">
              <div className="font-semibold text-slate-900">Weight Coordinates</div>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '480px' }}>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">#</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">
                      <MathComponent>I_3</MathComponent>
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">
                      <MathComponent>Y</MathComponent>
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">
                      <MathComponent>h_1</MathComponent>
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">
                      <MathComponent>h_2</MathComponent>
                    </th>
                    <th className="px-2 py-2 text-center font-semibold text-slate-700">Mult.</th>
                  </tr>
                </thead>
                <tbody>
                  {weightData.weights.map((weight, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-50 ${
                        weight.multiplicity > 1 ? 'bg-amber-50' : ''
                      } ${idx > 0 ? 'border-t border-slate-100' : ''}`}
                    >
                      <td className="px-3 py-2 text-slate-600">{idx + 1}</td>
                      <td className="px-3 py-2 font-mono text-slate-900 text-xs">
                        {weight.i3.toFixed(4)}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-900 text-xs">
                        {weight.y.toFixed(4)}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-600 text-xs">
                        {weight.h1}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-600 text-xs">
                        {weight.h2}
                      </td>
                      <td className="px-2 py-2 text-center font-semibold text-slate-900">
                        {weight.multiplicity > 1 ? (
                          <span className="text-amber-700">×{weight.multiplicity}</span>
                        ) : (
                          weight.multiplicity
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-xs text-slate-500 px-3 py-2 bg-slate-50">
              Weights with multiplicity &gt; 1 are highlighted
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Generate weight positions for common SU(3) representations
 * FALLBACK for when backend is unavailable
 */
function generateWeightsForRepresentation(
  group: string,
  irrep: number[]
): WeightPoint[] | null {
  if (group === 'SU3' || group === 'SU(3)') {
    const [a1, a2] = irrep;

    // Fundamental: 3 = [1,0]
    if (a1 === 1 && a2 === 0) {
      return [
        { x: 0.5, y: 0.866, multiplicity: 1 },
        { x: -1, y: 0, multiplicity: 1 },
        { x: 0.5, y: -0.866, multiplicity: 1 },
      ];
    }

    // Anti-fundamental: 3̄ = [0,1]
    if (a1 === 0 && a2 === 1) {
      return [
        { x: -0.5, y: 0.866, multiplicity: 1 }, // Top-left vertex
        { x: 1, y: 0, multiplicity: 1 }, // Right vertex
        { x: -0.5, y: -0.866, multiplicity: 1 }, // Bottom vertex
      ];
    }

    // Adjoint: 8 = [1,1]
    if (a1 === 1 && a2 === 1) {
      return [
        { x: 0, y: 0, multiplicity: 2 }, // Center (multiplicity 2!)
        { x: 1, y: 0, multiplicity: 1 }, // Right
        { x: -1, y: 0, multiplicity: 1 }, // Left
        { x: 0.5, y: 0.866, multiplicity: 1 }, // Top-right
        { x: -0.5, y: 0.866, multiplicity: 1 }, // Top-left
        { x: 0.5, y: -0.866, multiplicity: 1 }, // Bottom-right
        { x: -0.5, y: -0.866, multiplicity: 1 }, // Bottom-left
      ];
    }

    // Sextet: 6 = [2,0]
    if (a1 === 2 && a2 === 0) {
      return [
        { x: 1, y: 0.577, multiplicity: 1 },
        { x: 0, y: 1.155, multiplicity: 1 },
        { x: -1, y: 0.577, multiplicity: 1 },
        { x: -1, y: -0.577, multiplicity: 1 },
        { x: 0, y: -1.155, multiplicity: 1 },
        { x: 1, y: -0.577, multiplicity: 1 },
      ];
    }

    // Decuplet: 10 = [3,0]
    if (a1 === 3 && a2 === 0) {
      return [
        { x: 1.5, y: 0.866, multiplicity: 1 },
        { x: 0.5, y: 0.866, multiplicity: 1 },
        { x: -0.5, y: 0.866, multiplicity: 1 },
        { x: -1.5, y: 0.866, multiplicity: 1 },
        { x: 1, y: 0, multiplicity: 1 },
        { x: 0, y: 0, multiplicity: 1 },
        { x: -1, y: 0, multiplicity: 1 },
        { x: 0.5, y: -0.866, multiplicity: 1 },
        { x: -0.5, y: -0.866, multiplicity: 1 },
        { x: 0, y: -1.732, multiplicity: 1 },
      ];
    }
  }

  return null;
}

/**
 * Draw weight diagram on canvas
 */
function drawWeightDiagram(
  ctx: CanvasRenderingContext2D,
  weights: WeightPoint[],
  width: number,
  height: number
) {
  const padding = 80;
  const centerX = width / 2;
  const centerY = height / 2;

  // Find bounds - use 1:1 aspect ratio for proper hexagon geometry
  const maxX = Math.max(...weights.map((w) => Math.abs(w.x)), 0.1);
  const maxY = Math.max(...weights.map((w) => Math.abs(w.y)), 0.1);
  const maxRange = Math.max(maxX, maxY);
  const scale = Math.min(width - 2 * padding, height - 2 * padding) / (2 * maxRange);

  // Clear canvas with white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Draw axes
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, centerY);
  ctx.lineTo(width - padding, centerY);
  ctx.moveTo(centerX, padding);
  ctx.lineTo(centerX, height - padding);
  ctx.stroke();

  // Draw axis labels
  ctx.fillStyle = '#64748b';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('I₃ (or h₁)', width - padding / 2, centerY + 20);
  ctx.save();
  ctx.translate(centerX - 30, padding / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Y (or h₂)', 0, 0);
  ctx.restore();

  // Draw connecting lines between outer weights (hexagon/polygon outline)
  const outerWeights = weights.filter((w) => Math.abs(w.x) > 0.01 || Math.abs(w.y) > 0.01);
  if (outerWeights.length >= 3) {
    // Sort by angle around center
    const sortedWeights = outerWeights.sort((a, b) => {
      const angleA = Math.atan2(a.y, a.x);
      const angleB = Math.atan2(b.y, b.x);
      return angleA - angleB;
    });
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    sortedWeights.forEach((w, i) => {
      const x = centerX + w.x * scale;
      const y = centerY - w.y * scale; // Flip Y
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.stroke();
  }

  // Draw weight points
  weights.forEach((weight) => {
    const x = centerX + weight.x * scale;
    const y = centerY - weight.y * scale; // Flip Y axis for screen coordinates

    // Draw dot with shadow for better visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fillStyle = '#ef4444'; // Red color
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw white border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.stroke();

    // Show multiplicity if > 1
    if (weight.multiplicity && weight.multiplicity > 1) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Draw text with black outline for contrast
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(`×${weight.multiplicity}`, x, y);
      ctx.fillText(`×${weight.multiplicity}`, x, y);
    }
  });

  // Draw origin marker
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
  ctx.stroke();
}

export default MultipletDiagramRenderer;
