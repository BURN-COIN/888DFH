import React, { useEffect, useState, useRef } from 'react';

interface SlotMachineProps {
  finalNumbers: [number, number, number];
  isSpinning: boolean;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({ finalNumbers, isSpinning }) => {
  const [displayNumbers, setDisplayNumbers] = useState<[number, number, number]>([0, 0, 0]);
  // Track spinning state of each reel independently
  const [activeReels, setActiveReels] = useState<[boolean, boolean, boolean]>([false, false, false]);

  // Manage the stopping sequence
  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];

    if (isSpinning) {
      // Start all reels immediately
      setActiveReels([true, true, true]);
    } else {
      // Stop sequence: Reel 3 -> Reel 2 -> Reel 1 (Indices: 2 -> 1 -> 0)
      // This creates the effect: ??1 -> ?51 -> 651
      
      const stopDelay = 600; // ms between each reel stop

      // Stop 3rd reel (Right)
      timeouts.push(setTimeout(() => {
        setActiveReels(prev => [prev[0], prev[1], false]);
      }, 0));

      // Stop 2nd reel (Middle)
      timeouts.push(setTimeout(() => {
        setActiveReels(prev => [prev[0], false, false]);
      }, stopDelay));

      // Stop 1st reel (Left)
      timeouts.push(setTimeout(() => {
        setActiveReels(prev => [false, false, false]);
      }, stopDelay * 2));
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isSpinning]);

  // Animation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayNumbers(prev => {
        return prev.map((num, idx) => {
          // If reel is active, generate random number
          if (activeReels[idx]) {
            return Math.floor(Math.random() * 10);
          }
          // If reel is stopped, snap to final number
          return finalNumbers[idx];
        }) as [number, number, number];
      });
    }, 50); // High speed update

    return () => clearInterval(interval);
  }, [activeReels, finalNumbers]);

  return (
    <div className="relative w-full max-w-md mx-auto my-6 p-4 bg-gradient-to-b from-red-950 to-black rounded-xl border-4 border-yellow-600 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
      {/* Decorative top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 px-6 py-1.5 rounded-full text-xs font-black text-red-950 uppercase tracking-[0.2em] shadow-lg border border-yellow-300 z-10">
        Lucky 888
      </div>

      <div className="flex justify-center items-center gap-2 sm:gap-4 bg-black p-4 rounded-lg shadow-[inset_0_0_20px_rgba(0,0,0,1)] border border-white/10">
        {displayNumbers.map((num, idx) => (
          <div 
            key={idx}
            className="relative w-20 h-28 sm:w-24 sm:h-32 bg-gradient-to-b from-gray-100 via-white to-gray-300 rounded-md overflow-hidden flex items-center justify-center border-[3px] border-gray-400 shadow-inner group"
          >
            {/* The Number */}
            <div 
                className={`
                    text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-600 to-red-800
                    transition-all duration-100
                    ${activeReels[idx] ? 'motion-blur scale-110 opacity-80' : 'scale-100 opacity-100'}
                `}
            >
              {num}
            </div>
            
            {/* Spinning Highlight Effect */}
            {activeReels[idx] && (
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            )}

            {/* Glass/Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10 pointer-events-none rounded-md shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"></div>
            <div className="absolute top-0 w-full h-[40%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
          </div>
        ))}
      </div>
      
      {/* Decorative Lights */}
      <div className={`absolute -bottom-2 left-4 w-3 h-3 rounded-full ${isSpinning ? 'bg-yellow-400 animate-ping' : 'bg-red-900'} transition-colors`}></div>
      <div className={`absolute -bottom-2 right-4 w-3 h-3 rounded-full ${isSpinning ? 'bg-yellow-400 animate-ping delay-75' : 'bg-red-900'} transition-colors`}></div>
    </div>
  );
};