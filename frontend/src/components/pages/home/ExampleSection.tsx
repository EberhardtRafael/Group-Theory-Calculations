'use client';

import { useTranslations } from 'next-intl';
import Icon from '@/components/ui/Icon';

const ExampleSection = () => {
  const t = useTranslations('home.example');

  return (
    <div className="bg-white rounded-lg shadow-md p-8 my-16">
      <div className="text-3xl font-bold mb-4">{t('title')}</div>
      <p className="text-gray-700 mb-6">{t('description')}</p>
      <div className="bg-gray-50 p-6 rounded font-mono text-sm">
        <div className="mb-2">
          <Icon name="SO(10)" /> <Icon name="arrow" /> <Icon name="SU(5)" /> <Icon name="tensor" />{' '}
          <Icon name="U(1)" />
        </div>
        <div className="mb-2 ml-8">
          <Icon name="arrow" /> <Icon name="SU(3)" /> <Icon name="tensor" /> <Icon name="SU(2)" />{' '}
          <Icon name="tensor" /> <Icon name="U(1)" /> <Icon name="tensor" /> <Icon name="U(1)" />
        </div>
        <div className="ml-16">
          <Icon name="arrow" /> <Icon name="SU(3)" /> <Icon name="tensor" /> <Icon name="SU(2)" />{' '}
          <Icon name="tensor" /> <Icon name="U(1)" />
          <Icon name="Y" />
        </div>
      </div>
      <p className="text-gray-600 mt-4 text-sm">{t('note')}</p>
    </div>
  );
};

export default ExampleSection;
