'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GroupSelector from '@/components/calculators/GroupSelector';
import TensorProductCalc from '@/components/calculators/TensorProductCalc';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';

const Calculator = () => {
  const t = useTranslations('calculator');
  const [selectedGroup, setSelectedGroup] = useState<string>('SU3');

  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-4xl font-bold text-slate-900 mb-8">{t('title')}</div>

          <div className="grid md:grid-cols-[280px_1fr] gap-6">
            {/* Left Panel - Controls */}
            <div>
              <Card title={t('selectGroup')} className="sticky top-4">
                <GroupSelector selectedGroup={selectedGroup} onGroupChange={setSelectedGroup} />
              </Card>
            </div>

            {/* Right Panel - Results */}
            <div className="space-y-6">
              <Card title={t('tensorProduct')}>
                <TensorProductCalc group={selectedGroup} />
              </Card>

              <Card title={t('dynkinDiagram')}>
                <p className="text-gray-500">{t('comingSoon')}</p>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Calculator;
