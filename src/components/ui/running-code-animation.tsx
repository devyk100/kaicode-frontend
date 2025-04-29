import React, { useState, useEffect } from 'react';

const RunningCodeAnimation: React.FC = () => {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(prev => (prev % 3) + 1);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='text-center h-full items-center flex text-sm font-semibold'>
      Running Code{'.'.repeat(dotCount)}
    </div>
  );
};

export default RunningCodeAnimation;
