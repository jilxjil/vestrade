import ThemedCard from '@/components/ThemedCard';
import ThemedText from '@/components/ThemedText';
import { useTheme } from '@/contexts/ThemeContext';
import { fileManager } from '@/utils/fileManager';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

interface VoiceRecorderProps {
  onRecordingComplete?: (uri: string) => void;
  initialRecordingUri?: string;
  onDelete?: () => void;
}

const VoiceRecorder = ({ onRecordingComplete, initialRecordingUri, onDelete }: VoiceRecorderProps) => {
  const { theme, colorScheme } = useTheme();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(initialRecordingUri || null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission required', 'Please grant microphone permissions to record voice notes.');
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);

      // Update duration every second
      const interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Store interval to clear later
      (recording as any).interval = interval;

    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (uri) {
        // Save to local storage using file manager
        const fileInfo = await fileManager.saveVoiceNote(uri);
        setRecordingUri(fileInfo.uri);
        setRecordingDuration(0);
        onRecordingComplete?.(fileInfo.uri);
      }
      
      setRecording(null);
      setIsRecording(false);
      
      // Clear interval
      if ((recording as any).interval) {
        clearInterval((recording as any).interval);
      }

    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Error', 'Failed to stop recording. Please try again.');
    }
  };

  const playRecording = async () => {
    if (!recordingUri) return;

    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);
      setPlaybackDuration(0);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPlaybackDuration(status.positionMillis / 1000);
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPlaybackDuration(0);
          }
        }
      });

    } catch (err) {
      console.error('Failed to play recording', err);
      Alert.alert('Error', 'Failed to play recording. Please try again.');
    }
  };

  const stopPlaying = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setPlaybackDuration(0);
    }
  };

  const deleteRecording = async () => {
    if (recordingUri) {
      try {
        // Delete from local storage
        const files = await fileManager.getUserFiles();
        const fileToDelete = files.find(f => f.uri === recordingUri);
        if (fileToDelete) {
          await fileManager.deleteFile(fileToDelete.id);
        }
        
        setRecordingUri(null);
        onDelete?.();
      } catch (err) {
        console.error('Failed to delete recording', err);
        Alert.alert('Error', 'Failed to delete recording. Please try again.');
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ThemedCard className="p-4">
      <ThemedText className="text-lg font-semibold mb-3">Voice Notes</ThemedText>
      
      {!recordingUri ? (
        // Recording interface
        <View className="items-center">
          <Pressable
            className={`w-16 h-16 rounded-full items-center justify-center ${
              isRecording ? 'bg-red-500' : 'bg-teal-500'
            }`}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Ionicons 
              name={isRecording ? 'stop' : 'mic'} 
              size={24} 
              color="white" 
            />
          </Pressable>
          
          <ThemedText className="mt-2 text-sm opacity-70">
            {isRecording ? `Recording... ${formatTime(recordingDuration)}` : 'Tap to record'}
          </ThemedText>
        </View>
      ) : (
        // Playback interface
        <View className="items-center">
          <View className="flex-row items-center space-x-4">
            <Pressable
              className={`w-12 h-12 rounded-full items-center justify-center ${
                isPlaying ? 'bg-red-500' : 'bg-teal-500'
              }`}
              onPress={isPlaying ? stopPlaying : playRecording}
            >
              <Ionicons 
                name={isPlaying ? 'stop' : 'play'} 
                size={20} 
                color="white" 
              />
            </Pressable>
            
            <Pressable
              className="w-12 h-12 rounded-full items-center justify-center bg-red-500"
              onPress={deleteRecording}
            >
              <Ionicons name="trash" size={20} color="white" />
            </Pressable>
          </View>
          
          <ThemedText className="mt-2 text-sm opacity-70">
            {isPlaying ? `Playing... ${formatTime(playbackDuration)}` : 'Tap to play'}
          </ThemedText>
        </View>
      )}
    </ThemedCard>
  );
};

export default VoiceRecorder; 