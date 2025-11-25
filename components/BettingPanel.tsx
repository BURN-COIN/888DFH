
import React from 'react';
import { BetCategory, CATEGORY_LABELS } from '../types';
import { Coins, Trash2, Keyboard, LayoutGrid, Scale } from 'lucide-react';

interface BettingPanelProps {
  currentBets: Record<string, number>;
  onPlaceBet: (category: BetCategory, amount: number) => void;
  onClearBets: () => void;
  selectedChip: number;
  disabled: boolean;
  userBalance: number;
  targetNumber: string;
  onSetTargetNumber: (num: string) => void;
}

export const BettingPanel: React.FC<BettingPanelProps> = ({ 
  currentBets, 
  onPlaceBet, 
  onClearBets, 
  selectedChip, 
  disabled,
  userBalance,
  targetNumber,
  onSetTargetNumber
}) => {
  
  const handleBet = (category: BetCategory) => {
    if (disabled) return;
    if (userBalance < selectedChip) {
      alert("余额不足！");
      return;
    }
    
    if (category === BetCategory.CUSTOM) {
        if (targetNumber.length !== 3) {
            alert("请先输入完整的3位数字！");
            return;
        }
    }
    
    onPlaceBet(category, selectedChip);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
    onSetTargetNumber(val);
  };

  const renderBetButton = (category: BetCategory, colorClass: string, labelOverride?: string) => {
      const currentBetAmount = currentBets[category] || 0;
      const label = labelOverride || CATEGORY_LABELS[category];
      const [mainLabel, odds] = label.split(' ');

      return (
        <button
          key={category}
          onClick={() => handleBet(category)}
          disabled={disabled}
          className={`
            relative p-3 rounded-lg border transition-all duration-100 active:scale-95
            flex flex-col items-center justify-center
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5 cursor-pointer'}
            ${currentBetAmount > 0 
              ? `${colorClass} shadow-[0_0_10px_rgba(255,255,255,0.2)]` 
              : 'bg-black/30 border-white/10 hover:border-white/30'}
          `}
        >
          <span className="text-sm md:text-base font-bold text-gray-100">
            {mainLabel}
          </span>
          <span className="text-[10px] text-gray-400 font-mono">
            {odds}
          </span>
          
          {/* Chip Visual */}
          {currentBetAmount > 0 && (
            <div className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 px-1 rounded-full bg-yellow-500 border border-white text-red-900 font-bold flex items-center justify-center text-[10px] shadow-lg z-10">
              {currentBetAmount >= 1000 ? `${(currentBetAmount/1000).toFixed(1)}k` : currentBetAmount}
            </div>
          )}
        </button>
      );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg text-yellow-200 font-bold flex items-center gap-2">
          <Coins className="w-5 h-5" /> 下注面板
        </h3>
        <button 
          onClick={onClearBets}
          disabled={disabled || Object.keys(currentBets).length === 0}
          className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 disabled:opacity-30 transition"
        >
          <Trash2 className="w-4 h-4" /> 清空下注
        </button>
      </div>

      {/* Main Patterns */}
      <div className="grid grid-cols-3 gap-3">
         {renderBetButton(BetCategory.LEOPARD, 'bg-red-900/60 border-yellow-500')}
         {renderBetButton(BetCategory.STRAIGHT, 'bg-red-900/60 border-yellow-500')}
         {renderBetButton(BetCategory.PAIR, 'bg-red-900/60 border-yellow-500')}
      </div>

      {/* Basic Properties: Big/Small/Odd/Even */}
      <div className="grid grid-cols-4 gap-2">
        {renderBetButton(BetCategory.BIG, 'bg-blue-900/50 border-blue-400')}
        {renderBetButton(BetCategory.SMALL, 'bg-blue-900/50 border-blue-400')}
        {renderBetButton(BetCategory.ODD, 'bg-green-900/50 border-green-400')}
        {renderBetButton(BetCategory.EVEN, 'bg-green-900/50 border-green-400')}
      </div>

      {/* Combination Properties */}
      <div className="grid grid-cols-4 gap-2">
        {renderBetButton(BetCategory.BIG_ODD, 'bg-purple-900/50 border-purple-400')}
        {renderBetButton(BetCategory.BIG_EVEN, 'bg-purple-900/50 border-purple-400')}
        {renderBetButton(BetCategory.SMALL_ODD, 'bg-purple-900/50 border-purple-400')}
        {renderBetButton(BetCategory.SMALL_EVEN, 'bg-purple-900/50 border-purple-400')}
      </div>

      {/* Custom Number Section */}
      <div className="bg-black/20 border border-yellow-900/30 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 mt-2">
          <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="text-yellow-500 font-bold flex items-center gap-2 whitespace-nowrap text-sm">
                  <Keyboard className="w-4 h-4" />
                  自选
              </div>
              <input 
                  type="text" 
                  inputMode="numeric"
                  value={targetNumber}
                  onChange={handleNumberChange}
                  placeholder="000"
                  disabled={disabled}
                  className="w-full md:w-24 bg-black/60 border border-yellow-700/50 rounded py-1.5 px-2 text-center text-xl font-mono text-yellow-100 tracking-[0.2em] focus:outline-none focus:border-yellow-500 transition-colors placeholder-gray-700"
              />
          </div>

          <button
              onClick={() => handleBet(BetCategory.CUSTOM)}
              disabled={disabled}
              className={`
                relative flex-1 w-full md:w-auto py-2 px-4 rounded-lg border transition-all duration-100
                flex items-center justify-center gap-2
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5 active:scale-95 cursor-pointer'}
                ${(currentBets[BetCategory.CUSTOM] || 0) > 0 
                  ? 'bg-orange-900/40 border-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.3)]' 
                  : 'bg-black/40 border-orange-900/50 hover:border-orange-500'}
              `}
            >
              <div className="flex flex-col items-start">
                  <span className="text-orange-300 font-bold text-sm">下注自选 (100倍)</span>
                  <span className="text-[10px] text-orange-400/70">
                      {targetNumber.length === 3 ? `当前: ${targetNumber}` : '请输入3位数字'}
                  </span>
              </div>

               {/* Chip Visual for Custom */}
               {(currentBets[BetCategory.CUSTOM] || 0) > 0 && (
                <div className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 px-1 rounded-full bg-orange-500 border border-white text-white font-bold flex items-center justify-center text-[10px] shadow-lg z-10">
                   {(currentBets[BetCategory.CUSTOM] || 0) >= 1000 ? `${((currentBets[BetCategory.CUSTOM] || 0)/1000).toFixed(1)}k` : (currentBets[BetCategory.CUSTOM] || 0)}
                </div>
              )}
          </button>
      </div>
      
      <div className="text-center text-[10px] text-gray-500">
        大≥500, 小≤499, 单/双为数字值奇偶。结果优先级仅适用于豹子/顺子/对子判定。
      </div>
    </div>
  );
};
