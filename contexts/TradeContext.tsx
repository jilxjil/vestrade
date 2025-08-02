import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type Trade = {
  id: string;
  date: string;
  symbol: string;
  direction: 'Long' | 'Short';
  entryPrice: number;
  exitPrice?: number; // Optional for open trades
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  status: 'open' | 'closed'; // New field to track trade status
  result?: 'win' | 'loss'; // Optional for open trades
  pnl?: number; // Optional for open trades
  tags: string[];
  emotion: 'confident' | 'nervous' | 'frustrated' | 'excited' | 'calm' | 'anxious' | 'neutral';
  voiceNoteUri?: string;
  notes?: string;
  screenshots?: string[];
};

const DEMO_TRADES: Trade[] = [
  {
    id: '1',
    date: '2024-06-01',
    symbol: 'USD/CAD',
    direction: 'Long',
    entryPrice: 1.3500,
    exitPrice: 1.3550,
    quantity: 1,
    stopLoss: 1.3450,
    takeProfit: 1.3600,
    status: 'closed',
    result: 'win',
    pnl: 50,
    tags: ['SRS'],
    emotion: 'confident',
  },
  {
    id: '2',
    date: '2024-06-02',
    symbol: 'DAX',
    direction: 'Short',
    entryPrice: 16000,
    exitPrice: 15900,
    quantity: 0.5,
    stopLoss: 16100,
    takeProfit: 15800,
    status: 'closed',
    result: 'win',
    pnl: 50,
    tags: ['Pullback'],
    emotion: 'excited',
  },
  {
    id: '3',
    date: '2024-06-03',
    symbol: 'NASDAQ',
    direction: 'Long',
    entryPrice: 14000,
    exitPrice: 13900,
    quantity: 1,
    stopLoss: 13950,
    takeProfit: 14100,
    status: 'closed',
    result: 'loss',
    pnl: -100,
    tags: ['MTR'],
    emotion: 'nervous',
  },
  {
    id: '4',
    date: '2024-06-04',
    symbol: 'USD/CAD',
    direction: 'Short',
    entryPrice: 1.3550,
    exitPrice: 1.3500,
    quantity: 2,
    stopLoss: 1.3600,
    takeProfit: 1.3450,
    status: 'closed',
    result: 'win',
    pnl: 100,
    tags: ['SRS', 'Pullback'],
    emotion: 'confident',
  },
];

const TRADES_KEY = 'user_trades';

const TradeContext = createContext<any>(undefined);

export const TradeProvider = ({ children }: { children: ReactNode }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(TRADES_KEY);
      if (stored) {
        setTrades(JSON.parse(stored));
        setIsDemo(false);
      } else {
        setTrades(DEMO_TRADES);
        setIsDemo(true);
      }
    })();
  }, []);

  const addTrade = async (trade: Trade) => {
    const newTrades = isDemo ? [trade] : [...trades, trade];
    setTrades(newTrades);
    setIsDemo(false);
    await AsyncStorage.setItem(TRADES_KEY, JSON.stringify(newTrades));
  };

  const updateTrade = async (tradeId: string, updates: Partial<Trade>) => {
    const updatedTrades = trades.map(trade => 
      trade.id === tradeId ? { ...trade, ...updates } : trade
    );
    setTrades(updatedTrades);
    await AsyncStorage.setItem(TRADES_KEY, JSON.stringify(updatedTrades));
  };

  const closeTrade = async (tradeId: string, exitPrice: number) => {
    const trade = trades.find(t => t.id === tradeId);
    if (!trade) return;

    // Calculate PnL based on direction
    let pnl: number;
    if (trade.direction === 'Long') {
      pnl = (exitPrice - trade.entryPrice) * trade.quantity;
    } else {
      pnl = (trade.entryPrice - exitPrice) * trade.quantity;
    }

    // Determine result
    const result: 'win' | 'loss' = pnl > 0 ? 'win' : 'loss';

    await updateTrade(tradeId, {
      exitPrice,
      status: 'closed',
      result,
      pnl
    });
  };

  // --- Analytics helpers ---
  const totalTrades = trades.length;
  const wins = trades.filter(t => t.result === 'win');
  const losses = trades.filter(t => t.result === 'loss');
  const winRate = totalTrades ? (wins.length / totalTrades * 100).toFixed(1) : '0.0';
  const avgWin = wins.length ? (wins.reduce((sum, t) => sum + (t.pnl || 0), 0) / wins.length).toFixed(2) : '0.00';
  const avgLoss = losses.length ? (losses.reduce((sum, t) => sum + (t.pnl || 0), 0) / losses.length).toFixed(2) : '0.00';
  const expectancy = (Number(winRate) / 100 * Number(avgWin) + (1 - Number(winRate) / 100) * Number(avgLoss)).toFixed(2);
  // Streaks
  let winStreak = 0, lossStreak = 0, maxWinStreak = 0, maxLossStreak = 0;
  trades.forEach(t => {
    if (t.result === 'win') {
      winStreak++;
      maxWinStreak = Math.max(maxWinStreak, winStreak);
      lossStreak = 0;
    } else {
      lossStreak++;
      maxLossStreak = Math.max(maxLossStreak, lossStreak);
      winStreak = 0;
    }
  });
  // PnL by tag
  const pnlByTag: Record<string, { pnl: number; count: number }> = {};
  trades.forEach(t => {
    t.tags.forEach(tag => {
      if (!pnlByTag[tag]) pnlByTag[tag] = { pnl: 0, count: 0 };
      pnlByTag[tag].pnl += t.pnl || 0; // Handle optional pnl
      pnlByTag[tag].count++;
    });
  });
  // PnL by symbol
  const pnlBySymbol: Record<string, { pnl: number; count: number }> = {};
  trades.forEach(t => {
    if (!pnlBySymbol[t.symbol]) pnlBySymbol[t.symbol] = { pnl: 0, count: 0 };
    pnlBySymbol[t.symbol].pnl += t.pnl || 0; // Handle optional pnl
    pnlBySymbol[t.symbol].count++;
  });

  return (
    <TradeContext.Provider value={{
      trades,
      addTrade,
      updateTrade,
      closeTrade,
      isDemo,
      // Analytics
      totalTrades,
      winRate,
      avgWin,
      avgLoss,
      expectancy,
      maxWinStreak,
      maxLossStreak,
      pnlByTag,
      pnlBySymbol,
    }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrades = () => {
  const ctx = useContext(TradeContext);
  if (!ctx) throw new Error('useTrades must be used within a TradeProvider');
  return ctx;
}; 