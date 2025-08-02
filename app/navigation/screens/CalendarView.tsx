import ThemedCard from '@/components/ThemedCard';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Trade, useTrades } from '@/contexts/TradeContext';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

const CalendarView = ({ navigation }: any) => {
  const { theme, colorScheme } = useTheme();
  const { trades } = useTrades();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get current month's first day and number of days
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayWeekday = firstDayOfMonth.getDay();

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = [];
    
    // Add empty days for padding
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }
    
    return days;
  }, [currentDate, firstDayWeekday, daysInMonth]);

  // Get trades for a specific date
  const getTradesForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return trades.filter((trade: Trade) => trade.date === dateString);
  };

  // Get trades for selected date
  const selectedDateTrades = selectedDate ? getTradesForDate(selectedDate) : [];

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Get day summary (wins/losses)
  const getDaySummary = (date: Date) => {
    const dayTrades = getTradesForDate(date);
    const wins = dayTrades.filter((trade: Trade) => trade.result === 'win').length;
    const losses = dayTrades.filter((trade: Trade) => trade.result === 'loss').length;
    const totalPnL = dayTrades.reduce((sum: number, trade: Trade) => sum + (trade.pnl || 0), 0);
    
    return { wins, losses, totalPnL, totalTrades: dayTrades.length };
  };

  // Render calendar day
  const renderCalendarDay = (date: Date | null, index: number) => {
    if (!date) {
      return (
        <View key={index} className="w-[14.28%] h-12 items-center justify-center" />
      );
    }

    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    const daySummary = getDaySummary(date);
    const hasTrades = daySummary.totalTrades > 0;

    return (
      <Pressable
        key={index}
        className="w-[14.28%] h-12 items-center justify-center"
        onPress={() => setSelectedDate(date)}
      >
        <View className={`w-8 h-8 rounded-full items-center justify-center ${
          isSelected ? 'bg-teal-500' : isToday ? 'bg-teal-100 dark:bg-teal-900' : ''
        }`}>
          <ThemedText 
            className={`text-sm font-medium ${
              isSelected ? 'text-white' : isToday ? 'text-teal-600 dark:text-teal-400' : ''
            }`}
          >
            {date.getDate()}
          </ThemedText>
        </View>
        
        {/* Trade indicators */}
        {hasTrades && (
          <View className="flex-row justify-center mt-1 space-x-1">
            {daySummary.wins > 0 && (
              <View className="w-2 h-2 rounded-full bg-green-500" />
            )}
            {daySummary.losses > 0 && (
              <View className="w-2 h-2 rounded-full bg-red-500" />
            )}
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <ThemedView className="flex-1 pt-16">
      {/* Header */}
      <View className="p-4 border-b" style={{ borderBottomColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB' }}>
        <View className="flex-row items-center justify-between mb-4">
          <ThemedText className="text-2xl font-bold">Calendar</ThemedText>
          <Pressable 
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: Colors.primary }}
            onPress={goToToday}
          >
            <Text  className="text-white font-medium">Today</Text>
          </Pressable>
        </View>

        {/* Month Navigation */}
        <View className="flex-row items-center justify-between">
          <Pressable 
            className="p-2 rounded-lg"
            style={{ backgroundColor: colorScheme === 'dark' ? '#374151' : '#F3F4F6' }}
            onPress={goToPreviousMonth}
          >
            <Ionicons name="chevron-back" size={20} color={theme.text} />
          </Pressable>
          
          <ThemedText className="text-lg font-semibold">
            {formatDate(currentDate)}
          </ThemedText>
          
          <Pressable 
            className="p-2 rounded-lg"
            style={{ backgroundColor: colorScheme === 'dark' ? '#374151' : '#F3F4F6' }}
            onPress={goToNextMonth}
          >
            <Ionicons name="chevron-forward" size={20} color={theme.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Calendar Grid */}
        <View className="p-4">
          {/* Weekday Headers */}
          <View className="flex-row mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <View key={index} className="w-[14.28%] items-center">
                <ThemedText className="text-sm font-medium text-gray-500">
                  {day}
                </ThemedText>
              </View>
            ))}
          </View>

          {/* Calendar Days */}
          <View className="flex-row flex-wrap">
            {calendarDays.map((date, index) => renderCalendarDay(date, index))}
          </View>
        </View>

        {/* Selected Date Details */}
        {selectedDate && (
          <View className="p-4">
            <ThemedCard className="p-4">
              <View className="flex-row items-center justify-between mb-4">
                <ThemedText className="text-lg font-semibold">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </ThemedText>
                <Pressable onPress={() => setSelectedDate(null)}>
                  <Ionicons name="close" size={24} color={theme.text} />
                </Pressable>
              </View>

              {selectedDateTrades.length > 0 ? (
                <View className="space-y-3">
                  {selectedDateTrades.map((trade: Trade) => (
                    <Pressable
                      key={trade.id}
                      className="p-3 rounded-lg border"
                      style={{ 
                        borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
                        backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F9FAFB'
                      }}
                      onPress={() => navigation.navigate('TradeDetailsView', { trade })}
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center">
                          <View className={`w-3 h-3 rounded-full mr-2 ${
                            trade.result === 'win' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <ThemedText className="font-semibold">{trade.symbol}</ThemedText>
                        </View>
                        <ThemedText 
                          className={`font-bold ${
                            (trade.pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {(trade.pnl || 0) >= 0 ? '+' : ''}{(trade.pnl || 0)}
                        </ThemedText>
                      </View>
                      
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <ThemedText className="text-sm opacity-70">
                            {trade.direction} • {trade.quantity} lot
                          </ThemedText>
                        </View>
                        <View className="flex-row space-x-1">
                          {trade.tags.map((tag: string, index: number) => (
                            <View 
                              key={index}
                              className="px-2 py-1 rounded-full"
                              style={{ backgroundColor: Colors.primary + '20' }}
                            >
                              <ThemedText className="text-xs text-teal-600 dark:text-teal-400">
                                {tag}
                              </ThemedText>
                            </View>
                          ))}
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View className="items-center py-8">
                  <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
                  <ThemedText className="text-lg font-medium mt-2">No trades</ThemedText>
                  <ThemedText className="text-sm opacity-70 mt-1">
                    No trades recorded for this date
                  </ThemedText>
                </View>
              )}
            </ThemedCard>
          </View>
        )}

        {/* Month Summary */}
        <View className="p-4">
          <ThemedCard className="p-4">
            <ThemedText className="text-lg font-semibold mb-3">Month Summary</ThemedText>
            
            <View className="flex-row justify-between">
              <View className="items-center">
                <ThemedText className="text-2xl font-bold text-green-600">
                  {trades.filter((t: Trade) => {
                    const tradeDate = new Date(t.date);
                    return tradeDate.getMonth() === currentDate.getMonth() && 
                           tradeDate.getFullYear() === currentDate.getFullYear() &&
                           t.result === 'win';
                  }).length}
                </ThemedText>
                <ThemedText className="text-sm opacity-70">Wins</ThemedText>
              </View>
              
              <View className="items-center">
                <ThemedText className="text-2xl font-bold text-red-600">
                  {trades.filter((t: Trade) => {
                    const tradeDate = new Date(t.date);
                    return tradeDate.getMonth() === currentDate.getMonth() && 
                           tradeDate.getFullYear() === currentDate.getFullYear() &&
                           t.result === 'loss';
                  }).length}
                </ThemedText>
                <ThemedText className="text-sm opacity-70">Losses</ThemedText>
              </View>
              
              <View className="items-center">
                <ThemedText className="text-2xl font-bold">
                  {trades.filter((t: Trade) => {
                    const tradeDate = new Date(t.date);
                    return tradeDate.getMonth() === currentDate.getMonth() && 
                           tradeDate.getFullYear() === currentDate.getFullYear();
                  }).length}
                </ThemedText>
                <ThemedText className="text-sm opacity-70">Total</ThemedText>
              </View>
              
              <View className="items-center">
                <ThemedText 
                  className={`text-2xl font-bold ${
                    trades.filter((t: Trade) => {
                      const tradeDate = new Date(t.date);
                      return tradeDate.getMonth() === currentDate.getMonth() && 
                             tradeDate.getFullYear() === currentDate.getFullYear();
                    }).reduce((sum: number, t: Trade) => sum + (t.pnl || 0), 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {trades.filter((t: Trade) => {
                    const tradeDate = new Date(t.date);
                    return tradeDate.getMonth() === currentDate.getMonth() && 
                           tradeDate.getFullYear() === currentDate.getFullYear();
                  }).reduce((sum: number, t: Trade) => sum + (t.pnl || 0), 0)}
                </ThemedText>
                <ThemedText className="text-sm opacity-70">PnL</ThemedText>
              </View>
            </View>
          </ThemedCard>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default CalendarView;