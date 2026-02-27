interface GroupSelectorProps {
  selectedGroup: string
  onGroupChange: (group: string) => void
}

const GROUPS = [
  { name: 'SU2', label: 'SU(2)', description: 'Isospin' },
  { name: 'SU3', label: 'SU(3)', description: 'Color' },
  { name: 'SU4', label: 'SU(4)', description: 'Flavor' },
  { name: 'SU5', label: 'SU(5)', description: 'GUT' },
  { name: 'SO10', label: 'SO(10)', description: 'Grand Unified' },
  { name: 'E6', label: 'E₆', description: 'Exceptional' },
]

export function GroupSelector({ selectedGroup, onGroupChange }: GroupSelectorProps) {
  return (
    <div className="space-y-2">
      {GROUPS.map((group) => (
        <button
          key={group.name}
          onClick={() => onGroupChange(group.name)}
          className={`w-full text-left px-4 py-3 rounded-lg transition ${
            selectedGroup === group.name
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="font-semibold">{group.label}</div>
          <div className={`text-sm ${
            selectedGroup === group.name ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {group.description}
          </div>
        </button>
      ))}
    </div>
  )
}
