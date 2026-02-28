'use client';

import { useTranslations } from 'next-intl';
import { Math } from '@/components/ui';

const ExampleSection = () => {
  const t = useTranslations('home.example');

  return (
    <div className="bg-white rounded-lg shadow-md p-8 my-16">
      <div className="text-3xl font-bold mb-4">{t('title')}</div>
      <p className="text-gray-700 mb-6">{t('description')}</p>
      <div className="bg-gray-50 p-6 rounded text-lg">
        <div className="mb-3">
          <Math>SO(10) \to SU(5) \times U(1)</Math>
        </div>
        <div className="mb-3 ml-12">
          <Math>\to SU(3) \times SU(2) \times U(1) \times U(1)</Math>
        </div>
        <div className="ml-24">
          <Math>\to SU(3) \times SU(2) \times U(1)_Y</Math>
        </div>
      </div>
      <p className="text-gray-600 mt-4 text-sm">{t('note')}</p>
    </div>
  );
};

export default ExampleSection;
