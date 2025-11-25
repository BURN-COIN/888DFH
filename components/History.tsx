import React from 'react';
import { HistoryItem, CATEGORY_LABELS } from '../types';

interface HistoryProps {
  history: HistoryItem[];
}

export const History: React.FC<HistoryProps> = ({ history }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-4 bg-black/30 rounded-lg border border-yellow-900/30">
      <h3 className="text-yellow-500 text-sm font-bold mb-3 uppercase tracking-wider">近期开奖记录</h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {history.slice(0, 10).map((item) => (
          <div key={item.id} className={`flex-shrink-0 flex flex-col items-center p-2 rounded border w-24 ${item.isCustomWin ? 'bg-purple-900/40 border-purple-500' : 'bg-black/50 border-white/10'}`}>
            <div className="font-mono text-lg font-bold text-white tracking-widest">
              {item.numbers.join('')}
            </div>
            <div className={`text-xs mt-1 ${item.winAmount > 0 ? 'text-green-400' : 'text-gray-500'} truncate w-full text-center`}>
               {item.isCustomWin && "自选 "}
               {item.resultCategory !== 'NONE' ? CATEGORY_LABELS[item.resultCategory].split(' ')[0] : (item.isCustomWin ? '中奖' : '无')}
            </div>
          </div>
        ))}
        {history.length === 0 && <div className="text-gray-500 text-sm italic">暂无记录</div>}
      </div>
    </div>
  );
};