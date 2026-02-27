import { clsx } from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = ({ label, error, helperText, className, ...props }: InputProps) => {
  return (
    <div className="space-y-2">
      {label && <label className="block text-base font-medium text-slate-700">{label}</label>}
      <input
        className={clsx(
          'w-full px-4 py-2.5 border rounded-lg transition text-base',
          'focus:ring-2 focus:ring-slate-400 focus:border-transparent',
          error ? 'border-red-300 focus:ring-red-500' : 'border-slate-300',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="text-sm text-slate-500">{helperText}</p>}
    </div>
  );
};

export default Input;
