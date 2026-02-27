import { clsx } from 'clsx';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  description?: string;
  value: string;
}

const Radio = ({ label, description, value, className, ...props }: RadioProps) => {
  return (
    <label
      className={clsx(
        'flex items-start gap-3 p-3 rounded-lg cursor-pointer transition',
        'hover:bg-slate-50',
        className
      )}
    >
      <input
        type="radio"
        className="mt-1 w-4 h-4 accent-slate-600 focus:ring-0 focus:ring-offset-0 border-slate-300"
        value={value}
        {...props}
      />
      <div className="flex-1">
        <div className="font-semibold text-slate-900 text-base">{label}</div>
        {description && <div className="text-sm text-slate-600">{description}</div>}
      </div>
    </label>
  );
};

export default Radio;
