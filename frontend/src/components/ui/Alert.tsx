import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: ReactNode;
  className?: string;
}

const variantStyles = {
  success: 'bg-green-50 border-green-200 text-green-700',
  error: 'bg-red-50 border-red-200 text-red-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700',
};

const Alert = ({ variant = 'info', title, children, className }: AlertProps) => {
  return (
    <div className={clsx('border px-4 py-3 rounded-lg', variantStyles[variant], className)}>
      {title && <div className="font-semibold mb-1">{title}</div>}
      <div>{children}</div>
    </div>
  );
};

export default Alert;
