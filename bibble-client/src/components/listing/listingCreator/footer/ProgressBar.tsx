import React, { useEffect, useState } from 'react';

interface Props {
  stage: number;
  totalStages: number;
}

const ProgressBar: React.FC<Props> = ({ stage, totalStages }) => {
  const initialWidth = localStorage.getItem('progressBarWidth');
  const [width, setWidth] = useState(
    initialWidth ? Number(initialWidth) : ((stage - 1) / totalStages) * 100
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newWidth = (stage / totalStages) * 100;
      setWidth(newWidth);
      localStorage.setItem('progressBarWidth', String(newWidth));
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [stage, totalStages]);

  return (
    <div className="relative h-1 bg-gray-200">
      <div
        className="absolute left-0 top-0 h-full bg-gray-700 transition-all duration-500 ease-in-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export default ProgressBar;
