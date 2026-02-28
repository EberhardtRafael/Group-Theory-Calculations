'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { DissertationExample } from '@/data/dissertation-examples';
import { api } from '@/services/api';
import type { TensorProductResponse, IrrepResponse } from '@/types/api';
import { DynkinDiagramRenderer, MultipletDiagramRenderer } from '../../diagrams';
import Alert from '../../ui/Alert';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Math from '../../ui/Math';
import Modal from '../../ui/Modal';

const DissertationExampleCard = ({ example }: { example: DissertationExample }) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<TensorProductResponse | null>(null);
  const [irrepResult, setIrrepResult] = useState<IrrepResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDynkin, setShowDynkin] = useState(false);
  const [showMultiplet, setShowMultiplet] = useState(false);

  const handleCalculate = async () => {
    setIsCalculating(true);
    setError(null);
    setResult(null);

    try {
      if (
        example.calculation.type === 'tensor_product' &&
        example.calculation.irrep1 &&
        example.calculation.irrep2
      ) {
        const response = await api.calculateTensorProduct({
          group: example.group,
          irrep1: example.calculation.irrep1,
          irrep2: example.calculation.irrep2,
        });
        setResult(response.data);
      }
    } catch {
      setError(
        'Calculation failed. Backend may not be running or this feature is not yet implemented.'
      );
    } finally {
      setIsCalculating(false);
    }
  };

  const handleBuildIrrep = async () => {
    setIsCalculating(true);
    setError(null);
    setIrrepResult(null);

    try {
      if (example.calculation.type === 'irrep' && example.calculation.irrep) {
        const response = await api.createIrrep({
          group_id: example.group,
          highest_weight: example.calculation.irrep,
          method: 'weyl_reflection',
        });
        setIrrepResult(response.data);
        // Show the multiplet diagram modal with the visual representation
        setShowMultiplet(true);
      }
    } catch {
      setError(
        'Irrep construction failed. Backend may not be running or this calculation is not yet supported.'
      );
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header with Figure Number */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded">
                Fig {example.figureNumber}
              </span>
              <span className="text-xs text-slate-500">Section {example.section}</span>
              {example.page && <span className="text-xs text-slate-400">p. {example.page}</span>}
            </div>
            <h3 className="text-lg font-bold text-slate-900">{example.title}</h3>
            <div className="text-sm text-slate-600 mt-1">
              Group: <Math>{example.group}</Math>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowDynkin(true)}>
            Dynkin
          </Button>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-700 leading-relaxed">{example.description}</p>

        {/* Link to Dissertation */}
        {example.dissertationChapterId && (
          <Link
            href={`/dissertation/${example.dissertationChapterId}`}
            className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 hover:underline font-medium"
          >
            📖 Read about this in the dissertation → Section {example.section}
          </Link>
        )}

        {/* Physics Context */}
        {example.physicsContext && (
          <div className="text-xs bg-amber-50 p-3 rounded border-l-2 border-amber-400">
            <span className="font-semibold text-amber-800">Physics Context:</span>{' '}
            <span className="text-slate-700">{example.physicsContext}</span>
          </div>
        )}

        {/* Calculation Details */}
        {(() => {
          const calcTypeConfig = {
            irrep: {
              bg: 'bg-blue-50',
              textColor: 'text-blue-800',
              title: 'Irrep Construction',
              content: example.calculation.irrep && (
                <div className="text-sm">
                  Highest Weight: <Math>{`(${example.calculation.irrep.join(',')})`}</Math>
                </div>
              ),
            },
            tensor_product: {
              bg: 'bg-purple-50',
              textColor: 'text-purple-800',
              title: 'Tensor Product',
              content: (
                <div className="text-center text-base">
                  <Math>
                    {`(${example.calculation.irrep1?.join(',')}) \\otimes (${example.calculation.irrep2?.join(',')})`}
                  </Math>
                </div>
              ),
            },
            symmetry_breaking: {
              bg: 'bg-red-50',
              textColor: 'text-red-800',
              title: 'Symmetry Breaking',
              content: (
                <div className="text-sm">
                  Cross node {example.calculation.nodeToBreak} ({example.calculation.method})
                </div>
              ),
            },
            multiplet: {
              bg: 'bg-green-50',
              textColor: 'text-green-800',
              title: 'Quantum Number Space',
              content: example.calculation.irrep && (
                <div className="text-sm">
                  Irrep: <Math>{`(${example.calculation.irrep.join(',')})`}</Math>
                </div>
              ),
            },
          };

          const config = calcTypeConfig[example.calculation.type as keyof typeof calcTypeConfig];
          return config ? (
            <div className={`${config.bg} p-3 rounded-lg`}>
              <div className={`text-xs font-semibold ${config.textColor} mb-1`}>{config.title}</div>
              {config.content}
            </div>
          ) : null;
        })()}

        {/* Expected Result */}
        {example.expectedResult && (
          <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-400">
            <div className="text-xs font-semibold text-amber-800 mb-1">Expected Result</div>
            <div className="text-sm text-amber-900 font-mono">{example.expectedResult}</div>
          </div>
        )}

        {/* Physics Context */}
        {example.physicsContext && (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-emerald-700">🔬 Physics Context:</div>
            <p className="text-sm text-emerald-600 leading-relaxed">{example.physicsContext}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {(() => {
            const buttonConfig = {
              tensor_product: {
                onClick: handleCalculate,
                disabled: isCalculating,
                label: isCalculating ? 'Calculating...' : 'Calculate',
              },
              irrep: {
                onClick: handleBuildIrrep,
                disabled: isCalculating,
                label: isCalculating ? 'Building...' : 'Build Irrep',
              },
              symmetry_breaking: {
                variant: 'outline' as const,
                disabled: true,
                label: 'Break Symmetry (Coming Soon)',
              },
              multiplet: {
                onClick: () => setShowMultiplet(true),
                label: 'Draw Multiplet Diagram',
              },
            };

            const config = buttonConfig[example.calculation.type as keyof typeof buttonConfig];
            if (!config) return null;

            return (
              <Button
                onClick={'onClick' in config ? config.onClick : undefined}
                disabled={'disabled' in config ? config.disabled : undefined}
                variant={'variant' in config ? config.variant : undefined}
                className="flex-1"
              >
                {config.label}
              </Button>
            );
          })()}
        </div>

        {/* Error Display */}
        {error && <Alert variant="error">{error}</Alert>}

        {/* Irrep Result Display */}
        {irrepResult && (
          <div className="mt-4 space-y-3">
            <Alert variant="success">
              <div className="font-semibold mb-2">Irreducible Representation:</div>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Dimension', value: irrepResult.dimension },
                  { label: 'Highest Weight', value: `(${irrepResult.highest_weight.join(',')})`, isLatex: true },
                  { label: 'LaTeX Name', value: irrepResult.latex_name, isLatex: true },
                  { label: 'Number of Weights', value: irrepResult.weights.length },
                ].map(({ label, value, isLatex }) => (
                  <div key={label}>
                    <span className="font-semibold">{label}:</span>{' '}
                    {isLatex ? <Math>{value}</Math> : value}
                  </div>
                ))}
                {irrepResult.weights.length <= 10 && (
                  <div>
                    <span className="font-semibold">Weights:</span>
                    <div className="mt-1 space-y-1">
                      {irrepResult.weights.map((weight, idx) => (
                        <div key={idx} className="font-mono text-xs">
                          <Math>{`(${weight.join(',')})`}</Math>
                          {irrepResult.multiplicities[idx] > 1 && (
                            <span className="text-slate-500 ml-2">×{irrepResult.multiplicities[idx]}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Alert>
          </div>
        )}

        {/* Tensor Product Result Display */}
        {result && (
          <div className="mt-4 space-y-3">
            <Alert variant="success">
              <div className="font-semibold mb-2">Tensor Product Result:</div>
              <div className="text-center bg-white p-3 rounded">
                <Math>{result.latex}</Math>
              </div>
            </Alert>
          </div>
        )}

        {/* Dynkin Modal */}
        <Modal
          isOpen={showDynkin}
          onClose={() => setShowDynkin(false)}
          title={`Dynkin Diagram: ${example.group}`}
          size="lg"
        >
          <DynkinDiagramRenderer group={example.group} />
        </Modal>

        {/* Multiplet Diagram Modal */}
        <Modal
          isOpen={showMultiplet}
          onClose={() => setShowMultiplet(false)}
          title={`Multiplet Diagram: ${example.title}`}
          size="auto"
        >
          <MultipletDiagramRenderer
            group={example.group}
            irrep={example.calculation.irrep || [0, 0]}
          />
        </Modal>
      </div>
    </Card>
  );
};

export default DissertationExampleCard;
