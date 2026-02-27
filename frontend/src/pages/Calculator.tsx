import { useState } from 'react'
import { GroupSelector } from '@/components/calculators/GroupSelector'
import { TensorProductCalc } from '@/components/calculators/TensorProductCalc'

export function Calculator() {
  const [selectedGroup, setSelectedGroup] = useState<string>('SU3')

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Group Theory Calculator
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Panel - Controls */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Select Group</h2>
            <GroupSelector
              selectedGroup={selectedGroup}
              onGroupChange={setSelectedGroup}
            />
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Tensor Product</h2>
            <TensorProductCalc group={selectedGroup} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Dynkin Diagram</h2>
            <p className="text-gray-500">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
