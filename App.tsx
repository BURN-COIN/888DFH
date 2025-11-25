
import React, { useState } from 'react';
import { BetCategory, HistoryItem, ODDS } from './types';
import { calculateResultCategory, getRandomNumbers } from './services/gameLogic';
import { SlotMachine } from './components/SlotMachine';
import { BettingPanel } from './components/BettingPanel';
import { History } from './components/History';
import { CircleDollarSign, RotateCw, Volume2, VolumeX } from 'lucide-react';

const CHIP_VALUES = [1, 10, 100, 1000];

const App: React.FC = () => {
  const [balance, setBalance] = useState<number>(10000);
  const [bets, setBets] = useState<Record<string, number>>({});
  const [isSpinning, setIsSpinning] = useState(false);
  const [finalNumbers, setFinalNumbers] = useState<[number, number, number]>([8, 8, 8]);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedChip, setSelectedChip] = useState<number>(10);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Custom number state
  const [targetNumber, setTargetNumber] = useState<string>('888');

  // Computed total bet
  const totalBet = Object.values(bets).reduce((a: number, b: number) => a + b, 0);

  const handlePlaceBet = (category: BetCategory, amount: number) => {
    setLastWin(null);
    setResultMessage('');
    setBets(prev => ({
      ...prev,
      [category]: (prev[category] || 0) + amount
    }));
    setBalance(prev => prev - amount);
  };

  const handleClearBets = () => {
    // Return money to balance
    const returnedAmount = Object.values(bets).reduce((a: number, b: number) => a + b, 0);
    setBalance(prev => prev + returnedAmount);
    setBets({});
  };

  const spin = () => {
    if (totalBet === 0) {
      alert("请先下注！");
      return;
    }
    
    // Validate custom bet
    if (bets[BetCategory.CUSTOM] > 0 && targetNumber.length !== 3) {
        alert("自选号码必须是3位数！");
        return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    setLastWin(null);
    setResultMessage('');

    // Spin duration 2 seconds
    setTimeout(() => {
      const numbers = getRandomNumbers();
      setFinalNumbers(numbers);
      setIsSpinning(false);
      resolveGame(numbers);
    }, 2000);
  };

  const resolveGame = (numbers: [number, number, number]) => {
    const mainPatternCategory = calculateResultCategory(numbers[0], numbers[1], numbers[2]);
    const resultStr = numbers.join('');
    const numericValue = parseInt(resultStr, 10);
    
    let totalWinnings = 0;
    const winDetails: string[] = [];
    const specialWins: string[] = [];

    // --- 1. Evaluate Properties (Big/Small/Odd/Even) ---
    const isBig = numericValue >= 500;
    const isSmall = numericValue <= 499;
    const isOdd = numericValue % 2 !== 0;
    const isEven = numericValue % 2 === 0;

    const checkWin = (category: BetCategory, condition: boolean, name: string) => {
      if (condition) {
        specialWins.push(name);
        const betAmount = bets[category] || 0;
        if (betAmount > 0) {
          const win = betAmount * ODDS[category];
          totalWinnings += win;
          winDetails.push(`${name}(+${win})`);
        }
      }
    };

    checkWin(BetCategory.BIG, isBig, '大');
    checkWin(BetCategory.SMALL, isSmall, '小');
    checkWin(BetCategory.ODD, isOdd, '单');
    checkWin(BetCategory.EVEN, isEven, '双');
    
    checkWin(BetCategory.BIG_ODD, isBig && isOdd, '大单');
    checkWin(BetCategory.BIG_EVEN, isBig && isEven, '大双');
    checkWin(BetCategory.SMALL_ODD, isSmall && isOdd, '小单');
    checkWin(BetCategory.SMALL_EVEN, isSmall && isEven, '小双');

    // --- 2. Check Custom Number Win ---
    let isCustomWin = false;
    const customBetAmount = bets[BetCategory.CUSTOM] || 0;
    if (customBetAmount > 0 && resultStr === targetNumber) {
        const win = customBetAmount * ODDS[BetCategory.CUSTOM];
        totalWinnings += win;
        winDetails.push(`自选命中 (+${win})`);
        isCustomWin = true;
    }

    // --- 3. Check Pattern Win (Leopard > Straight > Pair) ---
    // Only one pattern wins per spin based on priority
    if (mainPatternCategory !== 'NONE') {
      const betAmount = bets[mainPatternCategory] || 0;
      if (betAmount > 0) {
        const win = betAmount * ODDS[mainPatternCategory];
        totalWinnings += win;
        winDetails.push(`${ODDS[mainPatternCategory]}倍 (+${win})`);
      }
    }

    // Update Balance
    if (totalWinnings > 0) {
      setBalance(prev => prev + totalWinnings);
      setLastWin(totalWinnings);
      setResultMessage(`恭喜！${winDetails.join('，')}！总赢得 ${totalWinnings}`);
    } else {
      let displayResult = mainPatternCategory !== 'NONE' ? mainPatternCategory : '';
      if (isBig) displayResult += ' 大'; else displayResult += ' 小';
      if (isOdd) displayResult += ' 单'; else displayResult += ' 双';
      setResultMessage(`开出：${resultStr} (${displayResult})`);
    }

    // Add to history
    const newHistoryItem: HistoryItem = {
      id: Date.now(),
      numbers,
      resultCategory: mainPatternCategory,
      timestamp: Date.now(),
      winAmount: totalWinnings,
      isCustomWin,
      specialWins
    };
    setHistory(prev => [newHistoryItem, ...prev]);

    // Clear bets for next round
    setBets({});
  };

  return (
    <div className="min-h-screen bg-[#2c0b0e] text-[#fce7ac] flex flex-col items-center overflow-x-hidden pb-10">
      
      {/* Header */}
      <header className="w-full bg-black/50 border-b border-yellow-900/50 p-4 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-red-900 font-black text-xl shadow-lg border-2 border-white">
              888
            </div>
            <h1 className="text-xl md:text-2xl font-bold gradient-text hidden sm:block">大富豪娱乐城</h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="bg-black/60 px-4 py-1.5 rounded-full border border-yellow-700 flex items-center gap-2">
               <CircleDollarSign className="text-yellow-400 w-5 h-5" />
               <span className="font-mono text-xl font-bold text-white">{balance.toLocaleString()}</span>
             </div>
             <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-yellow-600 hover:text-yellow-400">
               {soundEnabled ? <Volume2 size={20}/> : <VolumeX size={20}/>}
             </button>
          </div>
        </div>
      </header>

      {/* Game Area */}
      <main className="w-full max-w-2xl px-4 flex flex-col items-center">
        
        <SlotMachine finalNumbers={finalNumbers} isSpinning={isSpinning} />

        {/* Result Display */}
        <div className="min-h-[3rem] flex items-center justify-center mb-2 px-4 text-center">
           {resultMessage && (
             <div className={`px-4 py-2 rounded-xl text-sm md:text-base font-bold animate-bounce ${lastWin ? 'bg-yellow-500 text-red-900 shadow-[0_0_20px_rgba(234,179,8,0.6)]' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}>
               {resultMessage}
             </div>
           )}
        </div>

        {/* Chip Selection */}
        <div className="flex gap-4 mb-6 overflow-x-auto p-2 max-w-full justify-center">
          {CHIP_VALUES.map(val => (
            <button
              key={val}
              onClick={() => setSelectedChip(val)}
              className={`
                flex-shrink-0
                w-12 h-12 md:w-16 md:h-16 rounded-full border-2 flex flex-col items-center justify-center shadow-lg transition-transform active:scale-90
                ${selectedChip === val ? 'border-white bg-yellow-600 -translate-y-2' : 'border-yellow-800 bg-black/40 hover:bg-black/60'}
              `}
            >
              <div className="text-[10px] md:text-xs text-yellow-200">筹码</div>
              <div className="font-bold text-sm md:text-lg">{val}</div>
            </button>
          ))}

          {/* Show Hand / All In Button */}
          <button
              onClick={() => setSelectedChip(balance)}
              disabled={balance === 0}
              className={`
                flex-shrink-0
                w-12 h-12 md:w-16 md:h-16 rounded-full border-2 flex flex-col items-center justify-center shadow-lg transition-transform active:scale-90
                ${selectedChip === balance && balance > 0 ? 'border-red-400 bg-red-900 -translate-y-2 shadow-red-900/50' : 'border-red-900/50 bg-black/40 hover:bg-red-900/20'}
                ${balance === 0 ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="text-[10px] md:text-xs text-red-300">梭哈</div>
              <div className="font-bold text-xs md:text-sm text-red-100">All In</div>
          </button>
        </div>

        {/* Betting Board */}
        <BettingPanel 
          currentBets={bets} 
          onPlaceBet={handlePlaceBet}
          onClearBets={handleClearBets}
          selectedChip={selectedChip}
          disabled={isSpinning}
          userBalance={balance}
          targetNumber={targetNumber}
          onSetTargetNumber={setTargetNumber}
        />

        {/* Total Bet & Spin */}
        <div className="sticky bottom-4 z-40 w-full max-w-md bg-black/80 backdrop-blur border border-yellow-600/50 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 mt-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase">总下注</span>
            <span className="text-2xl font-bold text-yellow-400">{totalBet}</span>
          </div>
          
          <button
            onClick={spin}
            disabled={isSpinning || totalBet === 0}
            className={`
              flex-1 btn-shine bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500
              text-white font-black text-xl py-3 rounded-xl shadow-lg border-b-4 border-red-900
              flex items-center justify-center gap-2 transition-all
              ${(isSpinning || totalBet === 0) ? 'opacity-50 grayscale cursor-not-allowed border-none translate-y-1' : 'active:translate-y-1 active:border-b-0'}
            `}
          >
            {isSpinning ? (
              <>
                <RotateCw className="animate-spin" /> 开奖中...
              </>
            ) : '开始摇奖'}
          </button>
        </div>

        <History history={history} />
      </main>
    </div>
  );
};

export default App;
