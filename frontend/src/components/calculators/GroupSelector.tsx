'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Radio from '@/components/ui/Radio';
import Input from '@/components/ui/Input';

interface GroupSelectorProps {
  selectedGroup: string;
  onGroupChange: (group: string) => void;
}

interface GroupOption {
  name: string;
  label?: string;
  letter?: string;
  subscript?: string;
  descriptionKey: string;
}

const PREDEFINED_GROUPS: GroupOption[] = [
  { name: 'SU2', label: 'SU(2)', descriptionKey: 'isospin' },
  { name: 'SU3', label: 'SU(3)', descriptionKey: 'color' },
  { name: 'SU4', label: 'SU(4)', descriptionKey: 'flavor' },
  { name: 'SU5', label: 'SU(5)', descriptionKey: 'gut' },
  { name: 'SO10', label: 'SO(10)', descriptionKey: 'grandUnified' },
  { name: 'E6', letter: 'E', subscript: '6', descriptionKey: 'exceptionalE6' },
  { name: 'E7', letter: 'E', subscript: '7', descriptionKey: 'exceptionalE7' },
  { name: 'E8', letter: 'E', subscript: '8', descriptionKey: 'exceptionalE8' },
  { name: 'F4', letter: 'F', subscript: '4', descriptionKey: 'exceptionalF4' },
  { name: 'G2', letter: 'G', subscript: '2', descriptionKey: 'exceptionalG2' },
];

const GroupSelector = ({ selectedGroup, onGroupChange }: GroupSelectorProps) => {
  const t = useTranslations('groups');
  const [customGroup, setCustomGroup] = useState('');
  const [isCustomSelected, setIsCustomSelected] = useState(
    !PREDEFINED_GROUPS.some((g) => g.name === selectedGroup)
  );

  const handlePredefinedSelection = (groupName: string) => {
    setIsCustomSelected(false);
    onGroupChange(groupName);
  };

  const handleCustomSelection = () => {
    setIsCustomSelected(true);
    if (customGroup.trim()) {
      onGroupChange(customGroup.trim());
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomGroup(value);
    if (isCustomSelected && value.trim()) {
      onGroupChange(value.trim());
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5 max-h-96 overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:rgb(203_213_225)_transparent] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-button]:hidden">
        {PREDEFINED_GROUPS.map((group) => {
          const labelElement = group.letter ? (
            <span>
              <span className="text-[17px]">{group.letter}</span>
              <sub className="text-[0.7em]">{group.subscript}</sub>
            </span>
          ) : (
            group.label
          );

          return (
            <Radio
              key={group.name}
              name="group"
              value={group.name}
              label={labelElement}
              description={t(group.descriptionKey)}
              checked={selectedGroup === group.name && !isCustomSelected}
              onChange={() => handlePredefinedSelection(group.name)}
            />
          );
        })}

        {/* Custom group option */}
        <Radio
          name="group"
          value="custom"
          label="Custom"
          description="Enter any group"
          checked={isCustomSelected}
          onChange={handleCustomSelection}
        />
      </div>

      {/* Custom input field */}
      {isCustomSelected && (
        <div className="pl-6 space-y-2">
          <Input
            label="Group Name"
            type="text"
            value={customGroup}
            onChange={handleCustomInputChange}
            placeholder="e.g. SU(10), A9, SO(14), D7"
            className="text-sm"
          />
          <div className="text-xs text-slate-500 space-y-1">
            <div className="font-semibold">Notation examples:</div>
            <div>• Physics: SU(n), SO(n), Sp(2n)</div>
            <div>• Cartan: A_n = SU(n+1), B_n = SO(2n+1), C_n = Sp(2n), D_n = SO(2n)</div>
            <div>• Exceptional: E6, E7, E8, F4, G2</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupSelector;
