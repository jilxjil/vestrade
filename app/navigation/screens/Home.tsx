import ThemedCard from '@/components/ThemedCard'
import ThemedScroll from '@/components/ThemedScroll'
import ThemedText from '@/components/ThemedText'
import ThemedView from '@/components/ThemedView'
import DailyMotivation from '@/components/uiElements/DailyMotivation'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Trade, useTrades } from '@/contexts/TradeContext'
import { TouchableOpacity, View } from 'react-native'



const Home = ({navigation}:any) => {
  const {colorScheme, theme} = useTheme();
  const { user } = useAuth();
  
  const {
    trades,
    totalTrades,
    winRate,
    avgWin,
    avgLoss,
    expectancy,
    maxWinStreak,
    maxLossStreak,
  } = useTrades();

  // Most recent 4 trades
  const recentTrades = trades.slice(-4).reverse();

  // Calculate PnL and RRR for the summary
  const pnl = trades.reduce((sum: number, t: Trade) => sum + (t.pnl || 0), 0);
  // RRR: average of (takeProfit-entryPrice)/(entryPrice-stopLoss) for all trades
  const rrr = trades.length
    ? (
        trades.reduce((sum: number, t: Trade) => {
          const risk = Math.abs(t.entryPrice - t.stopLoss);
          const reward = Math.abs(t.takeProfit - t.entryPrice);
          return sum + (risk > 0 ? reward / risk : 0);
        }, 0) / trades.length
      ).toFixed(2)
    : '0.00';

  return (
    <ThemedScroll style={{ backgroundColor: colorScheme === 'dark' ? theme.background : '#F8FAFC' }} className="flex-1 pt-10">
      {/* Header */}
      <ThemedView className="flex-row justify-between items-center p-4 pt-12 mb-2">
        <ThemedText title className="text-3xl font-extrabold">Home</ThemedText>
        <TouchableOpacity>
          <View 
            style={{ backgroundColor: theme.uiBackground, borderWidth: 2, borderColor: theme.primary, shadowColor: theme.primary, shadowOpacity: 0.12, shadowRadius: 6, elevation: 4 }}
            className="w-12 h-12 rounded-full items-center justify-center"
          >
            <ThemedText style={{ color: theme.primary, fontSize: 28, fontWeight: 'bold' }}>
              {(user?.name?.[0] || 'U').toUpperCase()}
            </ThemedText>
          </View>
        </TouchableOpacity>
      </ThemedView>

      

      {/* Daily Motivation */}
      <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
        <DailyMotivation />
      </View>

      {/* Stats Grid */}
      <ThemedView className="px-4 mb-6">
        <View className="flex-row flex-wrap justify-between">
          {/* Total Trades */}
          <View style={{ flex: 1, marginRight: 8, marginBottom: 12 }}>
            <ThemedCard style={{ borderRadius: 18, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, padding: 18 }}>
              <ThemedText style={{ color: theme.text + '99', fontSize: 15, marginBottom: 2 }}>Total trades</ThemedText>
              <ThemedText title style={{ fontSize: 28, fontWeight: 'bold' }}>{totalTrades}</ThemedText>
          </ThemedCard>
          </View>
          {/* Win Rate */}
          <View style={{ flex: 1, marginLeft: 8, marginBottom: 12 }}>
            <ThemedCard style={{ borderRadius: 18, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, padding: 18 }}>
              <ThemedText style={{ color: theme.text + '99', fontSize: 15, marginBottom: 2 }}>Win rate</ThemedText>
              <ThemedText title style={{ fontSize: 28, fontWeight: 'bold' }}>{winRate}%</ThemedText>
          </ThemedCard>
          </View>
        </View>
        <View className="flex-row flex-wrap justify-between">
          {/* P&L */}
          <View style={{ flex: 1, marginRight: 8 }}>
            <ThemedCard style={{ borderRadius: 18, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, padding: 18 }}>
              <ThemedText style={{ color: theme.text + '99', fontSize: 15, marginBottom: 2 }}>P&L</ThemedText>
            <ThemedText 
              title 
                style={{ fontSize: 28, fontWeight: 'bold', color: pnl > 0 ? '#10B981' : '#EF4444' }}
            >
                ${pnl > 0 ? '+' : ''}{pnl.toFixed(2)}
            </ThemedText>
          </ThemedCard>
          </View>
          {/* RRR */}
          <View style={{ flex: 1, marginLeft: 8 }}>
            <ThemedCard style={{ borderRadius: 18, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, padding: 18 }}>
              <ThemedText style={{ color: theme.text + '99', fontSize: 15, marginBottom: 2 }}>RRR</ThemedText>
              <ThemedText title style={{ fontSize: 28, fontWeight: 'bold' }}>{rrr}</ThemedText>
          </ThemedCard>
          </View>
        </View>
      </ThemedView>

      {/* Trade History */}
      <ThemedView className="px-4">
        <ThemedText title className="text-xl font-bold mb-4">Recent Trades</ThemedText>
        {recentTrades.map((trade: Trade, index: number) => (
          <TouchableOpacity key={trade.id} onPress={() => navigation.navigate('TradeDetailsView', { trade })}>
            <ThemedCard style={{ borderRadius: 16, elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, marginBottom: 14, paddingVertical: 14, paddingHorizontal: 16 }}>
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <ThemedText title className="text-base font-semibold mr-3">
                    {trade.symbol}
                  </ThemedText>
                  {trade.status === 'open' ? (
                  <View 
                    style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        paddingHorizontal: 16,
                        paddingVertical: 6,
                        borderRadius: 999,
                        minWidth: 54,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                  >
                    <ThemedText 
                        className="text-base font-semibold"
                        style={{
                          color: '#3B82F6',
                          textAlign: 'center',
                        }}
                      >
                        OPEN
                      </ThemedText>
                    </View>
                  ) : (
                    <View 
                      style={{
                        backgroundColor: trade.result === 'win' 
                          ? 'rgba(16, 185, 129, 0.15)' 
                          : 'rgba(239, 68, 68, 0.15)',
                        paddingHorizontal: 16,
                        paddingVertical: 6,
                        borderRadius: 999,
                        minWidth: 54,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ThemedText 
                        className="text-base font-semibold"
                        style={{
                          color: trade.result === 'win' ? '#10B981' : '#EF4444',
                          textAlign: 'center',
                      }}
                    >
                      {trade.result}
                    </ThemedText>
                  </View>
                  )}
                </View>
                {trade.status === 'open' ? (
                  <ThemedText 
                    title 
                    className="text-lg font-bold"
                    style={{
                      color: '#3B82F6',
                      fontWeight: 'bold',
                    }}
                  >
                    OPEN
                  </ThemedText>
                ) : (
                <ThemedText 
                  title 
                  className="text-lg font-bold"
                  style={{
                      color: (trade.pnl || 0) > 0 ? '#10B981' : '#EF4444',
                      fontWeight: 'bold',
                  }}
                >
                    {(trade.pnl || 0) > 0 ? '+' : ''}${(trade.pnl || 0).toFixed(2)}
                </ThemedText>
                )}
              </View>
            </ThemedCard>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* Bottom spacing for tab bar */}
      <View className="h-20" />
    </ThemedScroll>
  )
}

export default Home