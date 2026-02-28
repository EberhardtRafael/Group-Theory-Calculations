'use client';

interface YoungTableauProps {
  rows: number[][];
  className?: string;
  cellSize?: number;
}

/**
 * Young Tableau Component
 *
 * Renders a Young tableau (diagram of boxes arranged in rows)
 *
 * @example
 * <YoungTableau rows={[[1, 2, 3], [4, 5], [6]]} />
 */
const YoungTableau = ({ rows, className = '', cellSize = 40 }: YoungTableauProps) => {
  if (!rows || rows.length === 0) {
    return <div className="text-gray-500 text-sm">No tableau data</div>;
  }

  return (
    <div className={`inline-block ${className}`}>
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex">
          {row.map((cell, cellIdx) => (
            <div
              key={cellIdx}
              className="border-2 border-slate-700 flex items-center justify-center font-semibold text-slate-900 bg-white"
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                marginRight: cellIdx < row.length - 1 ? '-2px' : '0',
                marginBottom: rowIdx < rows.length - 1 ? '-2px' : '0',
              }}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

interface StandardYoungTableauProps {
  shape: number[];
  className?: string;
}

/**
 * Standard Young Tableau (empty boxes showing shape only)
 *
 * @example
 * <StandardYoungTableau shape={[3, 2, 1]} />
 */
export const StandardYoungTableau = ({ shape, className = '' }: StandardYoungTableauProps) => {
  if (!shape || shape.length === 0) {
    return <div className="text-gray-500 text-sm">No shape data</div>;
  }

  // Create empty rows based on shape
  const rows = shape.map((count) => Array(count).fill(''));

  return (
    <div className={`inline-block ${className}`}>
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex">
          {row.map((_, cellIdx) => (
            <div
              key={cellIdx}
              className="border-2 border-slate-700 bg-blue-50"
              style={{
                width: '40px',
                height: '40px',
                marginRight: cellIdx < row.length - 1 ? '-2px' : '0',
                marginBottom: rowIdx < rows.length - 1 ? '-2px' : '0',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default YoungTableau;
