'use client';

import { useTranslations } from 'next-intl';

interface DecompositionTerm {
  weight: number[];
  dimension: number;
  name: string;
}

interface TensorProductResultProps {
  latex: string;
  decomposition: DecompositionTerm[];
}

const TensorProductResult = ({ latex, decomposition }: TensorProductResultProps) => {
  const t = useTranslations('tensorProduct');

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="font-semibold mb-2">{t('result')}</div>
      <div className="font-mono text-sm mb-4">{latex}</div>
      <div className="space-y-2">
        {decomposition.map((term, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span>
              {t('weight')}: {JSON.stringify(term.weight)}
            </span>
            <span>
              {t('dimension')}: {term.dimension}
            </span>
            <span className="font-semibold">{term.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TensorProductResult;
