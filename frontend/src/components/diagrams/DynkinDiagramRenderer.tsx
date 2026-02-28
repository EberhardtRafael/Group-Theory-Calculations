'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import type { DynkinDiagram } from '@/types/api';
import { Alert, Math as MathTeX } from '@/components/ui';

interface DynkinDiagramRendererProps {
  group: string;
  className?: string;
}

interface NodePosition {
  x: number;
  y: number;
}

/**
 * Calculate node positions for standard Dynkin diagrams based on Cartan type.
 * Returns a map of vertex index to {x, y} position.
 */
const calculateNodePositions = (
  cartan_type: string,
  vertices: number[]
): Map<number, NodePosition> => {
  const positions = new Map<number, NodePosition>();
  const spacing = 120; // horizontal spacing between nodes
  const baseX = 100;
  const baseY = 200;

  // Determine Cartan type (extract letter and number)
  const match = cartan_type.match(/^([A-G])(\d+)$/);
  if (!match) {
    // Fallback: horizontal line
    vertices.forEach((v, idx) => {
      positions.set(v, { x: baseX + idx * spacing, y: baseY });
    });
    return positions;
  }

  const [, series, nStr] = match;
  const n = Number.parseInt(nStr, 10);

  switch (series) {
    case 'A': {
      // A_n: Simple horizontal chain
      // O---O---O---O
      vertices.forEach((v, idx) => {
        positions.set(v, { x: baseX + idx * spacing, y: baseY });
      });
      break;
    }

    case 'B':
    case 'C': {
      // B_n and C_n: Horizontal chain (edges differ but layout same)
      // O---O---O==>O
      vertices.forEach((v, idx) => {
        positions.set(v, { x: baseX + idx * spacing, y: baseY });
      });
      break;
    }

    case 'D': {
      // D_n: Fork at the end
      //       O (n-2)
      //      /
      // O---O---...---O
      // 0   1      (n-3)  \
      //                    O (n-1)

      // Most nodes in a horizontal line
      for (let i = 0; i < n - 2; i++) {
        positions.set(vertices[i], { x: baseX + i * spacing, y: baseY });
      }

      // Last two nodes branch from the second-to-last node
      const branchX = baseX + (n - 3) * spacing;
      positions.set(vertices[n - 2], { x: branchX + spacing * 0.7, y: baseY - spacing * 0.6 });
      positions.set(vertices[n - 1], { x: branchX + spacing * 0.7, y: baseY + spacing * 0.6 });
      break;
    }

    case 'E': {
      // E_6, E_7, E_8: Main chain with branch at node 3
      //         O (2)
      //         |
      // O---O---O---O---O--- ...
      // 0   1   3   4   5 ...

      // Node 2 is above node 3
      positions.set(vertices[2], { x: baseX + 2 * spacing, y: baseY - spacing });

      // Main chain: 0, 1, 3, 4, 5, ...
      const mainChain = [0, 1, 3, 4, 5, 6, 7];
      mainChain.slice(0, n).forEach((nodeIdx, chainPos) => {
        if (nodeIdx !== 2) {
          positions.set(vertices[nodeIdx], { x: baseX + chainPos * spacing, y: baseY });
        }
      });
      break;
    }

    case 'F': {
      // F_4: Horizontal chain with double edge
      // O---O==>O---O
      vertices.forEach((v, idx) => {
        positions.set(v, { x: baseX + idx * spacing, y: baseY });
      });
      break;
    }

    case 'G': {
      // G_2: Two nodes with triple edge
      // O≡≡≡O
      vertices.forEach((v, idx) => {
        positions.set(v, { x: baseX + idx * spacing, y: baseY });
      });
      break;
    }

    default: {
      // Fallback: horizontal line
      vertices.forEach((v, idx) => {
        positions.set(v, { x: baseX + idx * spacing, y: baseY });
      });
    }
  }

  return positions;
};

/**
 * Calculate SVG viewBox dimensions based on node positions
 */
const calculateViewBox = (positions: Map<number, NodePosition>): string => {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const pos of positions.values()) {
    minX = Math.min(minX, pos.x);
    maxX = Math.max(maxX, pos.x);
    minY = Math.min(minY, pos.y);
    maxY = Math.max(maxY, pos.y);
  }

  const padding = 80;
  return `${minX - padding} ${minY - padding} ${maxX - minX + 2 * padding} ${maxY - minY + 2 * padding}`;
};

/**
 * Dynkin Diagram Renderer Component
 *
 * Fetches and displays the Dynkin diagram for a given Lie group
 */
const DynkinDiagramRenderer = ({ group, className = '' }: DynkinDiagramRendererProps) => {
  const [diagram, setDiagram] = useState<DynkinDiagram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiagram = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.getDynkinDiagram(group);
        setDiagram(response.data);
      } catch {
        setError(`Failed to load Dynkin diagram for ${group}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagram();
  }, [group]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading diagram...</div>
      </div>
    );
  }

  if (error || !diagram) {
    return <Alert variant="error">{error || 'Failed to load diagram'}</Alert>;
  }

  // Calculate node positions based on Cartan type
  const nodePositions = calculateNodePositions(diagram.cartan_type, diagram.vertices);
  const viewBox = calculateViewBox(nodePositions);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ASCII Diagram */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="text-sm font-semibold text-gray-600 mb-3">Diagram Structure:</div>
        <pre className="text-lg font-mono whitespace-pre-wrap">{diagram.diagram_string}</pre>
      </div>

      {/* Node Information */}
      <div>
        <div className="text-sm font-semibold text-gray-600 mb-3">Simple Roots:</div>
        <div className="flex flex-wrap gap-2">
          {diagram.node_labels.map((label, idx) => (
            <div key={idx} className="bg-blue-50 px-3 py-2 rounded border border-blue-200">
              <MathTeX>{label}</MathTeX>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Visualization */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-sm font-semibold text-gray-600 mb-4">
          Visual Representation: {diagram.cartan_type}
        </div>
        <svg viewBox={viewBox} className="w-full h-auto" style={{ minHeight: '300px' }}>
          {/* Draw edges first (so they appear behind nodes) */}
          {diagram.edges.map((edge, idx) => {
            const fromPos = nodePositions.get(edge.from);
            const toPos = nodePositions.get(edge.to);

            if (!fromPos || !toPos) return null;

            // Calculate angle and distance for node radius offset
            const dx = toPos.x - fromPos.x;
            const dy = toPos.y - fromPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const nodeRadius = 20;

            // Offset start and end points by node radius
            const offsetX = (dx / distance) * nodeRadius;
            const offsetY = (dy / distance) * nodeRadius;

            const x1 = fromPos.x + offsetX;
            const y1 = fromPos.y + offsetY;
            const x2 = toPos.x - offsetX;
            const y2 = toPos.y - offsetY;

            // Draw multiple lines for bonds > 1
            if (edge.type === 1) {
              return (
                <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth="2" />
              );
            }

            // For double/triple bonds, draw parallel lines
            const perpX = -dy / distance;
            const perpY = dx / distance;
            const offset = 4;

            return (
              <g key={idx}>
                {Array.from({ length: edge.type }, (_, i) => {
                  const shift = (i - (edge.type - 1) / 2) * offset;
                  return (
                    <line
                      key={i}
                      x1={x1 + perpX * shift}
                      y1={y1 + perpY * shift}
                      x2={x2 + perpX * shift}
                      y2={y2 + perpY * shift}
                      stroke="#64748b"
                      strokeWidth="2"
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Draw nodes */}
          {diagram.vertices.map((vertex) => {
            const pos = nodePositions.get(vertex);
            if (!pos) return null;

            return (
              <g key={vertex}>
                {/* Node circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="20"
                  fill="white"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
                {/* Node label */}
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  className="text-sm font-semibold fill-slate-700"
                >
                  {vertex + 1}
                </text>
                {/* Root label below */}
                <text
                  x={pos.x}
                  y={pos.y + 45}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {diagram.node_labels[vertex]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-gray-600">Cartan Type:</div>
          <div className="font-semibold">{diagram.cartan_type}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-gray-600">Rank:</div>
          <div className="font-semibold">{diagram.vertices.length}</div>
        </div>
      </div>
    </div>
  );
};

export default DynkinDiagramRenderer;
