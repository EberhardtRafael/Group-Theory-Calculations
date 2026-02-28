'use client';

import Math from './Math';

interface MathTextProps {
  children: string;
  className?: string;
}

/**
 * Component that renders text with mathematical symbols converted to LaTeX
 * Automatically converts: ⊗ → \otimes, ⊕ → \oplus, × → \times, → → \to, ≈ → \approx
 */
const MathText = ({ children, className = '' }: MathTextProps) => {
  // Map of Unicode symbols to LaTeX commands
  const symbolMap: Record<string, string> = {
    '⊗': '\\otimes',
    '⊕': '\\oplus',
    '×': '\\times',
    '→': '\\to',
    '≈': '\\approx',
  };

  // Split text by mathematical symbols while keeping the symbols
  const regex = /([⊗⊕×→≈])/g;
  const parts = children.split(regex);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        // If this part is a mathematical symbol, render it with Math component
        if (symbolMap[part]) {
          return <Math key={idx}>{symbolMap[part]}</Math>;
        }
        // Otherwise, render as plain text
        return <span key={idx}>{part}</span>;
      })}
    </span>
  );
};

export default MathText;
