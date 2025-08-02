import ThemedCard from '@/components/ThemedCard';
import ThemedText from '@/components/ThemedText';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

const tradingTips = [
  {
    id: 1,
    title: "Risk Management First",
    content: "Never risk more than 1-2% of your account on a single trade. Protect your capital above all else.",
    category: "Risk Management"
  },
  {
    id: 2,
    title: "Plan Your Trades",
    content: "Always have a clear entry, exit, and stop-loss before entering any position. Stick to your plan.",
    category: "Strategy"
  },
  {
    id: 3,
    title: "Emotional Discipline",
    content: "Trading is 80% psychology, 20% strategy. Keep your emotions in check and trade with a clear mind.",
    category: "Psychology"
  },
  {
    id: 4,
    title: "Learn from Losses",
    content: "Every loss is a lesson. Document what went wrong and use it to improve your trading strategy.",
    category: "Learning"
  },
  {
    id: 5,
    title: "Patience is Key",
    content: "Wait for high-probability setups. Don't force trades when the market doesn't offer clear opportunities.",
    category: "Patience"
  },
  {
    id: 6,
    title: "Focus on Process",
    content: "Focus on executing your trading plan perfectly, not on the money. The profits will follow.",
    category: "Mindset"
  },
  {
    id: 7,
    title: "Keep a Journal",
    content: "Document every trade, including your emotions and reasoning. This is your best learning tool.",
    category: "Journaling"
  },
  {
    id: 8,
    title: "Stay Humble",
    content: "The market is always right. Stay humble and be willing to adapt your strategy when needed.",
    category: "Mindset"
  }
];

const motivationalQuotes = [
  {
    quote: "The goal of a successful trader is to make the best trades. Money is secondary.",
    author: "Alexander Elder"
  },
  {
    quote: "In investing, what is comfortable is rarely profitable.",
    author: "Robert Arnott"
  },
  {
    quote: "Risk comes from not knowing what you're doing.",
    author: "Warren Buffett"
  },
  {
    quote: "The four most dangerous words in investing are: 'this time it's different.'",
    author: "Sir John Templeton"
  },
  {
    quote: "Know what you own, and know why you own it.",
    author: "Peter Lynch"
  }
];

const DailyMotivation = () => {
  const { theme, colorScheme } = useTheme();
  const [currentTip, setCurrentTip] = useState(tradingTips[0]);
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    // Get today's date to seed the random selection
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Use day of year to select consistent daily content
    const tipIndex = dayOfYear % tradingTips.length;
    const quoteIndex = dayOfYear % motivationalQuotes.length;
    
    setCurrentTip(tradingTips[tipIndex]);
    setCurrentQuote(motivationalQuotes[quoteIndex]);
  }, []);

  return (
    <ThemedCard className="p-4 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <ThemedText className="text-lg font-semibold">Daily Motivation</ThemedText>
        <View className="flex-row space-x-2">
          <Pressable
            className={`px-3 py-1 rounded-full ${showTip ? 'bg-teal-500' : 'bg-gray-300'}`}
            onPress={() => setShowTip(true)}
          >
            <ThemedText className={`text-xs font-medium ${showTip ? 'text-white' : 'text-gray-600'}`}>
              Tip
            </ThemedText>
          </Pressable>
          <Pressable
            className={`px-3 py-1 rounded-full ${!showTip ? 'bg-teal-500' : 'bg-gray-300'}`}
            onPress={() => setShowTip(false)}
          >
            <ThemedText className={`text-xs font-medium ${!showTip ? 'text-white' : 'text-gray-600'}`}>
              Quote
            </ThemedText>
          </Pressable>
        </View>
      </View>

      {showTip ? (
        <View>
          <View className="flex-row items-center mb-2">
            <Ionicons name="bulb-outline" size={20} color={theme.primary} />
            <ThemedText className="text-sm font-medium ml-2" style={{ color: theme.primary }}>
              {currentTip.category}
            </ThemedText>
          </View>
          <ThemedText className="text-base font-semibold mb-2">
            {currentTip.title}
          </ThemedText>
          <ThemedText className="text-sm opacity-80 leading-5">
            {currentTip.content}
          </ThemedText>
        </View>
      ) : (
        <View>
          <View className="flex-row items-center mb-2">
            <Ionicons name="chatbubble-outline" size={20} color={theme.primary} />
            <ThemedText className="text-sm font-medium ml-2" style={{ color: theme.primary }}>
              Trading Wisdom
            </ThemedText>
          </View>
          <ThemedText className="text-base font-semibold mb-2 italic">
            "{currentQuote.quote}"
          </ThemedText>
          <ThemedText className="text-sm opacity-70 text-right">
            — {currentQuote.author}
          </ThemedText>
        </View>
      )}
    </ThemedCard>
  );
};

export default DailyMotivation; 