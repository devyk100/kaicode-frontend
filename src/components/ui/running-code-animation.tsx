import React, { useState, useEffect } from 'react';

const RunningCodeAnimation: React.FC = () => {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(prev => (prev % 5) + 1);
    }, 200); // change every 500ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='text-lg font-semibold'>
      Running Code{'.'.repeat(dotCount)}
    </div>
  );
};

export default RunningCodeAnimation;
