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

const Icon = ({ name, size = 'md', className = '' }: IconProps) => {
  const sizeClass = SIZE_CLASSES[size];
  const symbol = MATH_ICONS[name];

  return <span className={`inline-block ${sizeClass} ${className}`}>{symbol}</span>;
};

export default Icon;
