'use client';

import { AxiosError } from 'axios';
import { type ChangeEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Alert, Button, Input } from '@/components/ui';
import { api } from '@/services/api';
import type { TensorProductResponse } from '@/types/api';
import TensorProductResult from './TensorProductResult';

interface TensorProductCalcProps {
  group: string;
}

const TensorProductCalc = ({ group }: TensorProductCalcProps) => {
  const t = useTranslations('tensorProduct');
  const [irrep1, setIrrep1] = useState<string>('[1,0]');
  const [irrep2, setIrrep2] = useState<string>('[1,0]');
  const [result, setResult] = useState<TensorProductResponse | null>(null);
  const [parsedIrrep1, setParsedIrrep1] = useState<number[]>([1, 0]);
  const [parsedIrrep2, setParsedIrrep2] = useState<number[]>([1, 0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);

    try {
      const weight1 = JSON.parse(irrep1);
      const weight2 = JSON.parse(irrep2);

      const response = await api.calculateTensorProduct({
        group,
        irrep1: weight1,
        irrep2: weight2,
      });
      setResult(response.data);
      setParsedIrrep1(weight1);
      setParsedIrrep2(weight2);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError(t('calculationFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t('firstIrrep')}
          type="text"
          value={irrep1}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setIrrep1(e.target.value)}
          placeholder="[1,0]"
        />
        <Input
          label={t('secondIrrep')}
          type="text"
          value={irrep2}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setIrrep2(e.target.value)}
          placeholder="[1,0]"
        />
      </div>

      <Button variant="primary" onClick={handleCalculate} disabled={loading} loading={loading}>
        {t('calculate')}
      </Button>

      {error && <Alert variant="error">{error}</Alert>}
      {result && (
        <TensorProductResult
          result={result}
          group={group}
          irrep1={parsedIrrep1}
          irrep2={parsedIrrep2}
        />
      )}
    </div>
  );
};

export default TensorProductCalc;
