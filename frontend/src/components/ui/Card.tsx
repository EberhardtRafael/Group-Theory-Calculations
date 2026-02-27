import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}

const Card = ({ title, subtitle, footer, className, children }: CardProps) => {
  return (
    <div className={clsx('bg-white rounded-lg shadow-md', className)}>
      {(title || subtitle) && (
        <div className="px-6 pt-6 pb-4">
          {title && <div className="text-2xl font-semibold text-gray-900">{title}</div>}
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="px-6 pb-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-200">{footer}</div>
      )}
    </div>
  );
};

export default Card;
