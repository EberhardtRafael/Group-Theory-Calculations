'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GroupSelector from '@/components/calculators/GroupSelector';
import TensorProductCalc from '@/components/calculators/TensorProductCalc';
import { Card, Button, Modal } from '@/components/ui';
import { DynkinDiagramRenderer } from '@/components/diagrams';

const Calculator = () => {
  const t = useTranslations('calculator');
  const [selectedGroup, setSelectedGroup] = useState<string>('SU3');
  const [isDynkinModalOpen, setIsDynkinModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
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
              <div className="space-y-4">
                <p className="text-gray-600">
                  View the Dynkin diagram for {selectedGroup} to understand its root system
                  structure.
                </p>
                <Button variant="primary" onClick={() => setIsDynkinModalOpen(true)}>
                  Show Dynkin Diagram
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Dynkin Diagram Modal */}
        <Modal
          isOpen={isDynkinModalOpen}
          onClose={() => setIsDynkinModalOpen(false)}
          title={`Dynkin Diagram: ${selectedGroup}`}
          size="lg"
        >
          <DynkinDiagramRenderer group={selectedGroup} />
        </Modal>
      </div>
    </div>
  );
};

export default Calculator;
