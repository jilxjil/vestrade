import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useTags } from '@/contexts/TagContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import EmotionSelector from './EmotionSelector';
import ScreenshotPicker from './ScreenshotPicker';
import VoiceRecorder from './VoiceRecorder';

interface JournalTabProps {
  selectedEmotion: string;
  onEmotionSelect: (emotion: string) => void;
  voiceNoteUri: string | null;
  onVoiceNoteChange: (uri: string | null) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  screenshots: string[];
  onScreenshotsChange: (screenshots: string[]) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const JournalTab = ({
  selectedEmotion,
  onEmotionSelect,
  voiceNoteUri,
  onVoiceNoteChange,
  notes,
  onNotesChange,
  screenshots,
  onScreenshotsChange,
  selectedTags,
  onTagsChange,
}: JournalTabProps) => {
  const { theme, colorScheme } = useTheme();
  const { tags } = useTags();
  const [newTag, setNewTag] = useState('');

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const addNewTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && !selectedTags.includes(newTag.trim())) {
      onTagsChange([...selectedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Emotional State */}
      <ThemedView className="mb-4">
        <EmotionSelector
          selectedEmotion={selectedEmotion}
          onEmotionSelect={onEmotionSelect}
        />
      </ThemedView>

      {/* Tags Section */}
      <ThemedView className="mb-4">
        <ThemedText className="text-lg font-semibold mb-3">Trade Tags</ThemedText>
        
        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <View className="mb-3">
            <ThemedText className="text-sm font-medium mb-2">Selected Tags:</ThemedText>
            <View className="flex-row flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <View
                  key={tag}
                  className="flex-row items-center px-3 py-2 rounded-full"
                  style={{ backgroundColor: '#06B6D4' }}
                >
                  <ThemedText className="text-white text-sm font-medium mr-2">{tag}</ThemedText>
                  <Pressable onPress={() => removeTag(tag)}>
                    <Ionicons name="close-circle" size={16} color="white" />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Available Tags */}
        <View className="mb-3">
          <ThemedText className="text-sm font-medium mb-2">Available Tags:</ThemedText>
          <View className="flex-row flex-wrap gap-2">
            {tags.map((tag) => (
              <Pressable
                key={tag}
                className={`px-3 py-2 rounded-full border ${
                  selectedTags.includes(tag) 
                    ? 'bg-teal-500 border-teal-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                onPress={() => toggleTag(tag)}
              >
                <ThemedText 
                  className={`text-sm font-medium ${
                    selectedTags.includes(tag) ? 'text-white' : ''
                  }`}
                >
                  {tag}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Add New Tag */}
        <View className="flex-row items-center space-x-2">
          <View className="flex-1">
            <TextInput
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Add custom tag..."
              style={{
                backgroundColor: theme.uiBackground,
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                color: theme.text,
                borderWidth: 1,
                borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
              }}
              placeholderTextColor={theme.text + '60'}
            />
          </View>
          <Pressable
            className="px-4 py-3 rounded-lg"
            style={{ backgroundColor: '#06B6D4' }}
            onPress={addNewTag}
          >
            <Ionicons name="add" size={20} color="white" />
          </Pressable>
        </View>
      </ThemedView>

      {/* Voice Recording */}
      <ThemedView className="mb-4">
        <VoiceRecorder
          onRecordingComplete={onVoiceNoteChange}
          initialRecordingUri={voiceNoteUri || undefined}
          onDelete={() => onVoiceNoteChange(null)}
        />
      </ThemedView>

      {/* Screenshots */}
      <ThemedView className="mb-4">
        <ScreenshotPicker
          screenshots={screenshots}
          onScreenshotsChange={onScreenshotsChange}
        />
      </ThemedView>

      {/* Notes */}
      <ThemedView className="mb-6">
        <ThemedText className="text-lg font-semibold mb-3">Trade Notes</ThemedText>
        <View style={{ backgroundColor: theme.uiBackground, borderRadius: 12, padding: 16 }}>
          <TextInput
            value={notes}
            onChangeText={onNotesChange}
            placeholder="Document your thoughts, strategy, lessons learned, or any observations about this trade..."
            multiline
            numberOfLines={6}
            style={{
              fontSize: 16,
              color: theme.text,
              minHeight: 120,
              textAlignVertical: 'top',
              lineHeight: 24,
            }}
            placeholderTextColor={theme.text + '60'}
          />
        </View>
        
        {/* Notes Tips */}
        <View className="mt-3">
          <ThemedText className="text-sm opacity-70 mb-2">💡 Consider documenting:</ThemedText>
          <View className="ml-4">
            <ThemedText className="text-xs opacity-60 mb-1">• What was your reasoning for this trade?</ThemedText>
            <ThemedText className="text-xs opacity-60 mb-1">• What emotions did you experience?</ThemedText>
            <ThemedText className="text-xs opacity-60 mb-1">• What could you have done better?</ThemedText>
            <ThemedText className="text-xs opacity-60 mb-1">• What lessons did you learn?</ThemedText>
            <ThemedText className="text-xs opacity-60">• How did the market behave vs. your expectations?</ThemedText>
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
};

export default JournalTab; 