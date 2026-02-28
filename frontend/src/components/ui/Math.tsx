'use client';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathProps {
  children: string;
  block?: boolean;
  className?: string;
}

/**
 * Math component for rendering LaTeX formulas
 *
 * @example
 * <Math>3 \otimes 3 = 6 \oplus \bar{3}</Math>
 * <Math block>E = mc^2</Math>
 */
const Math = ({ children, block = false, className = '' }: MathProps) => {
  if (block) {
    return (
      <div className={className}>
        <BlockMath math={children} />
      </div>
    );
  }

  return (
    <span className={className}>
      <InlineMath math={children} />
    </span>
  );
};

export default Math;
