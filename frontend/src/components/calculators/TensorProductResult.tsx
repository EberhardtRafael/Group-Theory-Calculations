'use client';

import { useTranslations } from 'next-intl';
import { Math, MathText } from '@/components/ui';
import Alert from '@/components/ui/Alert';
import type { TensorProductResponse } from '@/types/api';
import { getRepresentationPhysics, getTensorProductPhysics } from '@/utils/physics-interpretations';

interface TensorProductResultProps {
  result: TensorProductResponse;
  group: string;
  irrep1: number[];
  irrep2: number[];
}

const TensorProductResult = ({ result, group, irrep1, irrep2 }: TensorProductResultProps) => {
  const t = useTranslations('tensorProduct');

  // Get physics interpretation for the tensor product
  const irrep1Str = irrep1.join(',');
  const irrep2Str = irrep2.join(',');
  const physicsInterpretation = getTensorProductPhysics(group, irrep1Str, irrep2Str);

  return (
    <div className="space-y-4">
      {/* Main Result */}
      <div className="bg-slate-50 p-4 rounded-lg">
        <div className="font-semibold mb-2 text-slate-700">{t('result')}</div>
        <div className="text-lg mb-2 py-2 text-center">
          <Math>{result.latex}</Math>
        </div>
      </div>

      {/* Physics Interpretation  */}
      {physicsInterpretation && (
        <Alert className="bg-blue-50 border-blue-200">
          <div className="space-y-2">
            <div className="font-semibold text-blue-900">🔬 Physics Context:</div>
            <p className="text-sm text-blue-800">
              <MathText>{physicsInterpretation.physicsDescription}</MathText>
            </p>
            {physicsInterpretation.examples.length > 0 && (
              <div className="text-xs text-blue-700 mt-2 space-y-1">
                {physicsInterpretation.examples.map((ex, idx) => (
                  <div key={idx}>
                    • <MathText>{ex}</MathText>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Alert>
      )}

      {/* Decomposition Components */}
      <div className="space-y-2">
        <div className="font-semibold text-sm text-slate-700">Decomposition:</div>

        {result.decomposition.length === 0 ? (
          <Alert variant="warning">
            <div className="space-y-2">
              <div className="font-semibold">⚠️ Empty Result</div>
              <p className="text-sm">
                The tensor product calculation returned no components. This may occur if:
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 ml-2">
                <li>
                  The group <strong>{group}</strong> doesn't have tensor product support yet (only
                  SU(3) and SU(5) are currently supported)
                </li>
                <li>The irrep weights are invalid for the selected group</li>
                <li>There was an issue with the calculation</li>
              </ul>
              <p className="text-sm mt-2">
                For <strong>{group}</strong>, tensor products will be added in a future update. For
                now, you can still calculate irrep dimensions, Dynkin diagrams, and other
                properties.
              </p>
            </div>
          </Alert>
        ) : (
          <div className="space-y-2">
            {result.decomposition.map((term, idx) => {
              const physics = getRepresentationPhysics(group, term.latex_name);

              return (
                <div key={idx} className="bg-white border border-slate-200 rounded p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-base">
                      <Math>{term.latex_name}</Math>
                    </span>
                    <div className="text-sm text-slate-600 space-x-3">
                      <span>dim = {term.dimension}</span>
                      {term.multiplicity > 1 && (
                        <span className="text-amber-600">
                          <Math>\times</Math>
                          {term.multiplicity}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Physics interpretation for this irrep */}
                  {physics && (
                    <div className="text-xs text-slate-600 mt-2 pt-2 border-t border-slate-100">
                      <span className="font-semibold">{physics.name}:</span>{' '}
                      <MathText>{physics.description}</MathText>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TensorProductResult;
