import ThemedCard from '@/components/ThemedCard';
import ThemedText from '@/components/ThemedText';
import { useTheme } from '@/contexts/ThemeContext';
import { fileManager } from '@/utils/fileManager';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Pressable, ScrollView, View } from 'react-native';

interface ScreenshotPickerProps {
  screenshots: string[];
  onScreenshotsChange: (screenshots: string[]) => void;
}

const ScreenshotPicker = ({ screenshots, onScreenshotsChange }: ScreenshotPickerProps) => {
  const { theme, colorScheme } = useTheme();

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to add screenshots.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Save to local storage using file manager
        const fileInfo = await fileManager.saveScreenshot(result.assets[0].uri);
        const newScreenshots = [...screenshots, fileInfo.uri];
        onScreenshotsChange(newScreenshots);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Save to local storage using file manager
        const fileInfo = await fileManager.saveScreenshot(result.assets[0].uri);
        const newScreenshots = [...screenshots, fileInfo.uri];
        onScreenshotsChange(newScreenshots);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const removeScreenshot = async (index: number) => {
    try {
      const screenshotUri = screenshots[index];
      
      // Delete from local storage
      const files = await fileManager.getUserFiles();
      const fileToDelete = files.find(f => f.uri === screenshotUri);
      if (fileToDelete) {
        await fileManager.deleteFile(fileToDelete.id);
      }
      
      // Update state
      const newScreenshots = screenshots.filter((_, i) => i !== index);
      onScreenshotsChange(newScreenshots);
    } catch (error) {
      console.error('Error removing screenshot:', error);
      Alert.alert('Error', 'Failed to remove screenshot. Please try again.');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Screenshot',
      'Choose how to add a screenshot',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <ThemedCard className="p-4">
      <View className="flex-row items-center justify-between mb-3">
        <ThemedText className="text-lg font-semibold">Screenshots</ThemedText>
        <Pressable
          className="bg-teal-500 px-3 py-1 rounded-lg"
          onPress={showImageOptions}
        >
          <ThemedText className="text-white text-sm font-medium">Add</ThemedText>
        </Pressable>
      </View>

      {screenshots.length === 0 ? (
        <View className="items-center py-8">
          <Ionicons name="images-outline" size={48} color="#9CA3AF" />
          <ThemedText className="text-lg font-medium mt-2">No screenshots</ThemedText>
          <ThemedText className="text-sm opacity-70 mt-1 text-center">
            Add screenshots of your charts, entries, or trade setups
          </ThemedText>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {screenshots.map((uri, index) => (
              <View key={index} className="relative">
                <Image
                  source={{ uri }}
                  style={{
                    width: 120,
                    height: 90,
                    borderRadius: 8,
                  }}
                  resizeMode="cover"
                />
                <Pressable
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                  onPress={() => removeScreenshot(index)}
                >
                  <Ionicons name="close" size={16} color="white" />
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </ThemedCard>
  );
};

export default ScreenshotPicker; 