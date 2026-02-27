'use client';

import { useTranslations } from 'next-intl';
import Radio from '@/components/ui/Radio';

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

const GROUPS: GroupOption[] = [
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

  return (
    <div className="space-y-1.5 max-h-96 overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:rgb(203_213_225)_transparent] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-button]:hidden">
      {GROUPS.map((group) => {
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
            checked={selectedGroup === group.name}
            onChange={() => onGroupChange(group.name)}
          />
        );
      })}
    </div>
  );
};

export default GroupSelector;
