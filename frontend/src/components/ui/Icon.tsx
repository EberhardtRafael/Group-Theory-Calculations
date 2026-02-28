import { MATH_ICONS, type MathIconName } from '@/constants/icons';

interface IconProps {
  name: MathIconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_CLASSES = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

/**
 * Icon component for displaying mathematical symbols using Unicode.
 *
 * @deprecated For mathematical notation, use the <Math> component with LaTeX instead.
 * This provides better rendering, more symbols, and follows standard notation.
 *
 * @example
 * // Old (deprecated):
 * <Icon name="tensor" />
 *
 * // New (recommended):
 * import { Math } from '@/components/ui';
 * <Math>\otimes</Math>
 *
 * @see {@link file://./Math.tsx} for the preferred Math component
 * @see {@link file://../../docs/latex-guide.md} for LaTeX usage guide
 */
const Icon = ({ name, size = 'md', className = '' }: IconProps) => {
  const sizeClass = SIZE_CLASSES[size];
  const symbol = MATH_ICONS[name];

  return <span className={`inline-block ${sizeClass} ${className}`}>{symbol}</span>;
};

export default Icon;
