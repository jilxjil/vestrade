import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useTheme } from '@/contexts/ThemeContext';
import { useTrades } from '@/contexts/TradeContext';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';

const FILTERS = ['Today', 'This Week', 'This Month', 'Reset'];

function useFinanceQuote() {
  const [quote, setQuote] = useState<{q: string, a: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('https://zenquotes.io/api/quotes/finance')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const random = data[Math.floor(Math.random() * data.length)];
          setQuote(random);
        } else {
          setError('No quote found');
        }
      })
      .catch(() => setError('Failed to fetch quote'))
      .finally(() => setLoading(false));
  }, []);

  return { quote, loading, error };
}

const AnalyticsView = () => {
  const { theme, colorScheme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('Today');
  const { quote, loading, error } = useFinanceQuote();
  const {
    winRate,
    expectancy,
    avgWin,
    avgLoss,
    maxWinStreak,
    maxLossStreak,
    pnlByTag,
    pnlBySymbol,
    totalTrades,
  } = useTrades();

  // For alternating row backgrounds
  const getRowBg = (idx: number) =>
    idx % 2 === 0
      ? (colorScheme === 'dark' ? theme.background : '#F1F5F9')
      : (colorScheme === 'dark' ? theme.uiBackground : '#FFF');

  // Prepare stats
  const stats = [
    { label: 'Win Rate', value: `${winRate}%` },
    { label: 'Expectancy', value: expectancy },
    { label: 'Avg Win', value: `$${avgWin}` },
    { label: 'Avg loss', value: `$${avgLoss}` },
    { label: 'Win Streak', value: maxWinStreak },
    { label: 'Loss Streak', value: maxLossStreak },
    { label: 'Total Trades', value: totalTrades },
  ];

  // Prepare tag stats
  const tagStats = Object.entries(pnlByTag as Record<string, {pnl:number;count:number}>).map(([tag, { pnl, count }]) => ({
    tag,
    pnl,
    pnlPct: totalTrades ? `${Math.round((pnl / (Number(avgWin) * totalTrades)) * 100)}%` : '0%'
  }));

  // Prepare symbol stats
  const symbolStats = Object.entries(pnlBySymbol as Record<string, {pnl:number;count:number}>).map(([symbol, { pnl, count }]) => ({
    symbol,
    pnl,
    pnlPct: totalTrades ? `${Math.round((pnl / (Number(avgWin) * totalTrades)) * 100)}%` : '0%'
  }));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? theme.background : '#F8FAFC' }} className="pt-10">
      {/* Logo and Filters */}
      <ThemedView className="px-4 pt-10 pb-2">
        <ThemedText title className="text-2xl font-bold mb-4">Analytics</ThemedText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setSelectedFilter(f)}
              activeOpacity={0.85}
              style={{
                backgroundColor: selectedFilter === f ? theme.primary : theme.uiBackground,
                borderRadius: 20,
                paddingHorizontal: 20,
                paddingVertical: 10,
                marginRight: 10,
                marginBottom: 10,
                borderWidth: selectedFilter === f ? 2 : 1,
                borderColor: selectedFilter === f ? theme.primary : theme.uiBackground,
                shadowColor: selectedFilter === f ? theme.primary : 'transparent',
                shadowOpacity: selectedFilter === f ? 0.15 : 0,
                shadowRadius: selectedFilter === f ? 6 : 0,
                elevation: selectedFilter === f ? 2 : 0,
                transform: [{ scale: selectedFilter === f ? 1.05 : 1 }],
              }}
            >
              <ThemedText style={{ color: selectedFilter === f ? '#fff' : theme.text, fontWeight: 'bold', fontSize: 16 }}>{f}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      {/* Quote Card */}
      <View style={{ marginHorizontal: 16, marginVertical: 16, backgroundColor: theme.uiBackground, borderRadius: 18, padding: 22, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2, minHeight: 100, justifyContent: 'center' }}>
        {loading ? (
          <ActivityIndicator color={theme.primary} />
        ) : error ? (
          <ThemedText style={{ color: theme.text + '80', fontStyle: 'italic' }}>{error}</ThemedText>
        ) : quote ? (
          <>
            <ThemedText style={{ fontStyle: 'italic', color: theme.text + 'CC', fontSize: 17, marginBottom: 6 }}>
              {`“${quote.q}”`}
            </ThemedText>
            <ThemedText style={{ textAlign: 'right', color: theme.text + '80', fontSize: 15 }}>~{quote.a}</ThemedText>
          </>
        ) : null}
      </View>

      {/* Stat Cards */}
      <View style={{ marginHorizontal: 14, marginBottom: 24 }}>
        {stats.map((stat, idx) => (
          <View
            key={stat.label}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.background,
              borderRadius: 18,
              marginBottom: 18,
              borderWidth: 1,
              borderColor: colorScheme === 'dark' ? theme.uiBackground : '#E5E7EB',
              shadowColor: '#000',
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 1,
              paddingVertical: 22,
              paddingHorizontal: 22,
            }}
          >
            <View style={{ width: 5, height: 40, backgroundColor: colorScheme === 'dark' ? theme.primary : theme.primary, borderRadius: 3, marginRight: 18 }} />
            <ThemedText style={{ fontSize: 20, fontWeight: '700', flex: 1 }}>{stat.label}</ThemedText>
            <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>{stat.value}</ThemedText>
          </View>
        ))}
      </View>

      {/* Tag Table */}
      <View style={{ marginHorizontal: 14, marginBottom: 24, backgroundColor: theme.background, borderRadius: 18, borderWidth: 1, borderColor: colorScheme === 'dark' ? theme.uiBackground : '#E5E7EB', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}>
        <View style={{ flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 14, borderBottomWidth: 1, borderColor: colorScheme === 'dark' ? theme.uiBackground : '#E5E7EB', backgroundColor: theme.uiBackground }}>
          <ThemedText style={{ flex: 1, fontWeight: 'bold', fontSize: 16 }}>Tag</ThemedText>
          <ThemedText style={{ flex: 1, fontWeight: 'bold', textAlign: 'right', fontSize: 16 }}>PnL</ThemedText>
          <ThemedText style={{ flex: 1, fontWeight: 'bold', textAlign: 'right', fontSize: 16 }}>PnL%</ThemedText>
        </View>
        {tagStats.map((row, idx) => (
          <View key={row.tag} style={{ flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 14, backgroundColor: getRowBg(idx), borderBottomWidth: idx === tagStats.length - 1 ? 0 : 1, borderColor: colorScheme === 'dark' ? theme.uiBackground : '#E5E7EB' }}>
            <ThemedText style={{ flex: 1, fontSize: 15 }}>{row.tag}</ThemedText>
            <ThemedText style={{ flex: 1, textAlign: 'right', fontSize: 15 }}>{row.pnl}</ThemedText>
            <ThemedText style={{ flex: 1, textAlign: 'right', fontSize: 15 }}>{row.pnlPct}</ThemedText>
          </View>
        ))}
      </View>

      {/* Symbol Table */}
      <View style={{ marginHorizontal: 14, marginBottom: 40, backgroundColor: theme.background, borderRadius: 18, borderWidth: 1, borderColor: colorScheme === 'dark' ? theme.uiBackground : '#E5E7EB', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}>
        <View style={{ flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 14, borderBottomWidth: 1, borderColor: colorScheme === 'dark' ? theme.uiBackground : '#E5E7EB', backgroundColor: theme.uiBackground }}>
          <ThemedText style={{ flex: 1, fontWeight: 'bold', fontSize: 16 }}>Symbol</ThemedText>
          <ThemedText style={{ flex: 1, fontWeight: 'bold', textAlign: 'right', fontSize: 16 }}>PnL</ThemedText>
          <ThemedText style={{ flex: 1, fontWeight: 'bold', textAlign: 'right', fontSize: 16 }}>PnL%</ThemedText>
        </View>
        {symbolStats.map((row, idx) => (
          <View key={row.symbol} style={{ flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 14, backgroundColor: getRowBg(idx), borderBottomWidth: idx === symbolStats.length - 1 ? 0 : 1, borderColor: colorScheme === 'dark' ? theme.uiBackground : '#E5E7EB' }}>
            <ThemedText style={{ flex: 1, fontSize: 15 }}>{row.symbol}</ThemedText>
            <ThemedText style={{ flex: 1, textAlign: 'right', fontSize: 15 }}>{row.pnl}</ThemedText>
            <ThemedText style={{ flex: 1, textAlign: 'right', fontSize: 15 }}>{row.pnlPct}</ThemedText>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default AnalyticsView;