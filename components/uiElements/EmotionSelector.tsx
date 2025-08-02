import ThemedText from '@/components/ThemedText';
import { useTheme } from '@/contexts/ThemeContext';
import { Pressable, View } from 'react-native';

interface EmotionSelectorProps {
  selectedEmotion: string;
  onEmotionSelect: (emotion: string) => void;
}

const emotions = [
  { key: 'confident', label: 'Confident', icon: '😤', color: '#10B981' },
  { key: 'excited', label: 'Excited', icon: '🤩', color: '#F59E0B' },
  { key: 'calm', label: 'Calm', icon: '😌', color: '#3B82F6' },
  { key: 'neutral', label: 'Neutral', icon: '😐', color: '#6B7280' },
  { key: 'nervous', label: 'Nervous', icon: '😰', color: '#F59E0B' },
  { key: 'anxious', label: 'Anxious', icon: '😨', color: '#EF4444' },
  { key: 'frustrated', label: 'Frustrated', icon: '😤', color: '#DC2626' },
];

const EmotionSelector = ({ selectedEmotion, onEmotionSelect }: EmotionSelectorProps) => {
  const { theme, colorScheme } = useTheme();

  return (
    <View className="mb-4">
      <ThemedText className="text-sm font-medium mb-2">How are you feeling?</ThemedText>
      <View className="flex-row flex-wrap justify-between">
        {emotions.map((emotion) => (
          <Pressable
            key={emotion.key}
            className={`w-[30%] mb-3 p-3 rounded-lg border items-center ${
              selectedEmotion === emotion.key ? 'border-teal-500' : ''
            }`}
            style={{
              backgroundColor: selectedEmotion === emotion.key 
                ? emotion.color + '20' 
                : colorScheme === 'dark' ? '#374151' : '#F9FAFB',
              borderColor: selectedEmotion === emotion.key 
                ? emotion.color 
                : colorScheme === 'dark' ? '#4B5563' : '#E5E7EB',
            }}
            onPress={() => onEmotionSelect(emotion.key)}
          >
            <ThemedText className="text-2xl mb-1">{emotion.icon}</ThemedText>
            <ThemedText 
              className="text-xs font-medium"
              style={{ color: selectedEmotion === emotion.key ? emotion.color : theme.text }}
            >
              {emotion.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default EmotionSelector; 