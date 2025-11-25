import React from 'react';
import { HistoryItem, CATEGORY_LABELS } from '../types';
import { Clock } from 'lucide-react';

interface HistoryProps {
  history: HistoryItem[];
}

export const History: React.FC<HistoryProps> = ({ history }) => {
  // Helper to extract the most specific attribute (Combination) from the specialWins array
  const getDisplayAttributes = (wins: string[]) => {
    // Priority: Combinations (Big Odd, Big Even, Small Odd, Small Even)
    const combos = wins.filter(w => ['大单', '大双', '小单', '小双'].includes(w));
    if (combos.length > 0) return combos[0];
    
    // Fallback
    return [...new Set(wins)].join(' ');
  };

  return (
    <div className="w-full bg-black/40 border-b border-yellow-900/30 backdrop-blur-sm mb-4">
      <div className="max-w-4xl mx-auto px-4 py-2">
        <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3 h-3 text-yellow-600" />
            <h3 className="text-yellow-600/80 text-xs font-bold uppercase tracking-wider">
            近期开奖
            </h3>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {history.length === 0 && (
              <div className="text-gray-600 text-xs italic py-2">暂无记录</div>
          )}
          
          {history.slice(0, 20).map((item) => {
            const attributes = getDisplayAttributes(item.specialWins);
            const patternName = item.resultCategory !== 'NONE' ? CATEGORY_LABELS[item.resultCategory].split(' ')[0] : '';
            
            return (
              <div 
                key={item.id} 
                className={`
                  flex-shrink-0 flex flex-col items-center justify-center p-1 rounded border w-14 h-14 transition-all
                  ${item.isCustomWin 
                    ? 'bg-purple-900/30 border-purple-500/50' 
                    : item.winAmount > 0 ? 'bg-red-900/20 border-yellow-600/30' : 'bg-white/5 border-white/5'}
                `}
              >
                {/* Number */}
                <div className="font-mono text-lg font-bold text-white leading-none">
                  {item.numbers.join('')}
                </div>
                
                {/* Attributes (Compact) */}
                <div className="flex flex-col items-center w-full mt-1">
                  {patternName ? (
                     <div className="text-[9px] text-yellow-500 font-bold scale-90">
                        {patternName}
                     </div>
                  ) : (
                    <div className="text-[9px] text-gray-400 scale-90">
                        {attributes || '-'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};