'use client';

import { useState } from 'react';
import { api } from '@/services/api';
import type { TensorProductResponse } from '@/types/api';
import type { PhysicsExample } from '@/utils/physics-interpretations';
import { DynkinDiagramRenderer } from '../../diagrams';
import Alert from '../../ui/Alert';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Math from '../../ui/Math';
import Modal from '../../ui/Modal';

const LegacyExampleCard = ({ example }: { example: PhysicsExample }) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<TensorProductResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDynkin, setShowDynkin] = useState(false);

  const handleCalculate = async () => {
    setIsCalculating(true);
    setError(null);
    setResult(null);

    try {
      if (example.calculation.type === 'tensor_product') {
        const response = await api.calculateTensorProduct({
          group: example.group,
          irrep1: example.calculation.irrep1!,
          irrep2: example.calculation.irrep2!,
        });
        setResult(response.data);
      }
    } catch {
      setError('Failed to calculate. Make sure backend is running.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{example.title}</h3>
            <div className="text-sm text-slate-600 mt-1">
              Group: <Math>{example.group}</Math>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowDynkin(true)}>
            Dynkin
          </Button>
        </div>

        {example.calculation.type === 'tensor_product' && (
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-slate-700 mb-2">Calculation:</div>
            <div className="text-center text-lg">
              <Math>
                {[
                  example.calculation.irrep1Display ?? example.calculation.irrep1?.join(',') ?? '',
                  ' \\otimes ',
                  example.calculation.irrep2Display ?? example.calculation.irrep2?.join(',') ?? '',
                ].join('')}
              </Math>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-sm font-semibold text-slate-700">Physics Context:</div>
          <p className="text-sm text-slate-600 leading-relaxed">{example.physicsContext}</p>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-semibold text-emerald-700">Why It Matters:</div>
          <p className="text-sm text-emerald-600 leading-relaxed">{example.whyItMatters}</p>
        </div>

        {example.historicalNote && (
          <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-400">
            <div className="text-xs font-semibold text-amber-800 mb-1">📜 Historical Note</div>
            <p className="text-xs text-amber-700 leading-relaxed">{example.historicalNote}</p>
          </div>
        )}

        {example.calculation.type === 'tensor_product' && (
          <Button onClick={handleCalculate} disabled={isCalculating} className="w-full">
            {isCalculating ? 'Calculating...' : 'Calculate Result'}
          </Button>
        )}

        {error && <Alert variant="error">{error}</Alert>}

        {result && (
          <div className="mt-4 space-y-3">
            <Alert variant="success">
              <div className="font-semibold mb-2">Mathematical Result:</div>
              <div className="text-center bg-white p-3 rounded">
                <Math>{result.latex}</Math>
              </div>
            </Alert>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-700">Decomposition:</div>
              <div className="space-y-1">
                {result.decomposition.map((irrep, idx) => (
                  <div
                    key={`${irrep.latex_name}-${idx}`}
                    className="flex items-center justify-between bg-slate-50 p-2 rounded text-sm"
                  >
                    <span>
                      <Math>{irrep.latex_name}</Math>
                    </span>
                    <span className="text-slate-600">
                      dim = {irrep.dimension}
                      {irrep.multiplicity > 1 && (
                        <>
                          {' '}
                          (<Math>\times</Math>
                          {irrep.multiplicity})
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <Modal
          isOpen={showDynkin}
          onClose={() => setShowDynkin(false)}
          title={`Dynkin Diagram: ${example.group}`}
          size="lg"
        >
          <DynkinDiagramRenderer group={example.group} />
        </Modal>
      </div>
    </Card>
  );
};

export default LegacyExampleCard;
