import React, { useEffect, useState } from 'react';

interface SlotMachineProps {
  finalNumbers: [number, number, number];
  isSpinning: boolean;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({ finalNumbers, isSpinning }) => {
  const [displayNumbers, setDisplayNumbers] = useState<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isSpinning) {
      interval = setInterval(() => {
        setDisplayNumbers([
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
        ]);
      }, 50); // Fast cycle
    } else {
      setDisplayNumbers(finalNumbers);
    }

    return () => clearInterval(interval);
  }, [isSpinning, finalNumbers]);

  return (
    <div className="relative w-full max-w-md mx-auto my-6 p-4 bg-gradient-to-b from-red-900 to-black rounded-xl border-4 border-yellow-600 shadow-2xl">
      {/* Decorative top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-600 px-4 py-1 rounded-full text-xs font-bold text-red-900 uppercase tracking-widest shadow-lg">
        Lucky Roller
      </div>

      <div className="flex justify-center items-center gap-2 sm:gap-4 bg-black p-4 rounded-lg inset-shadow">
        {displayNumbers.map((num, idx) => (
          <div 
            key={idx}
            className="relative w-20 h-28 sm:w-24 sm:h-32 bg-gradient-to-b from-gray-100 to-gray-300 rounded overflow-hidden flex items-center justify-center border-2 border-gray-400 shadow-inner"
          >
            <div className={`text-6xl sm:text-7xl font-black text-red-600 ${isSpinning ? 'spin-blur' : ''}`}>
              {num}
            </div>
            
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
          </div>
        ))}
      </div>
      
      {/* Decorative Lights */}
      <div className="absolute -bottom-2 left-4 w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
      <div className="absolute -bottom-2 right-4 w-2 h-2 rounded-full bg-yellow-500 animate-pulse delay-75"></div>
    </div>
  );
};