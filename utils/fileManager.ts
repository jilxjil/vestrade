import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

// Local file management for screenshots and voice notes
// This replaces Firebase Storage functionality

export interface FileInfo {
  id: string;
  uri: string;
  type: 'screenshot' | 'voice';
  name: string;
  size?: number;
  createdAt: string;
}

class FileManager {
  private baseDir = `${FileSystem.documentDirectory}vestrade/`;
  private screenshotsDir = `${this.baseDir}screenshots/`;
  private voiceNotesDir = `${this.baseDir}voice/`;

  constructor() {
    this.initializeDirectories();
  }

  private async initializeDirectories() {
    try {
      // Create base directories if they don't exist
      const dirInfo = await FileSystem.getInfoAsync(this.baseDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.baseDir, { intermediates: true });
      }

      const screenshotsInfo = await FileSystem.getInfoAsync(this.screenshotsDir);
      if (!screenshotsInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.screenshotsDir, { intermediates: true });
      }

      const voiceInfo = await FileSystem.getInfoAsync(this.voiceNotesDir);
      if (!voiceInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.voiceNotesDir, { intermediates: true });
      }
    } catch (error) {
      console.error('Error initializing directories:', error);
    }
  }

  // Save screenshot from image picker
  async saveScreenshot(sourceUri: string): Promise<FileInfo> {
    try {
      await this.initializeDirectories();
      
      const fileName = `screenshot_${Date.now()}.jpg`;
      const destinationUri = `${this.screenshotsDir}${fileName}`;
      
      await FileSystem.copyAsync({
        from: sourceUri,
        to: destinationUri
      });

      const fileInfo: FileInfo = {
        id: fileName,
        uri: destinationUri,
        type: 'screenshot',
        name: fileName,
        createdAt: new Date().toISOString()
      };

      // Store file info in AsyncStorage for persistence
      await this.saveFileInfo(fileInfo);
      
      return fileInfo;
    } catch (error) {
      console.error('Error saving screenshot:', error);
      throw error;
    }
  }

  // Save voice recording
  async saveVoiceNote(sourceUri: string): Promise<FileInfo> {
    try {
      await this.initializeDirectories();
      
      const fileName = `voice_${Date.now()}.m4a`;
      const destinationUri = `${this.voiceNotesDir}${fileName}`;
      
      await FileSystem.copyAsync({
        from: sourceUri,
        to: destinationUri
      });

      const fileInfo: FileInfo = {
        id: fileName,
        uri: destinationUri,
        type: 'voice',
        name: fileName,
        createdAt: new Date().toISOString()
      };

      // Store file info in AsyncStorage for persistence
      await this.saveFileInfo(fileInfo);
      
      return fileInfo;
    } catch (error) {
      console.error('Error saving voice note:', error);
      throw error;
    }
  }

  // Get all files for a user
  async getUserFiles(): Promise<FileInfo[]> {
    try {
      const filesJson = await AsyncStorage.getItem('vestrade_files');
      return filesJson ? JSON.parse(filesJson) : [];
    } catch (error) {
      console.error('Error getting user files:', error);
      return [];
    }
  }

  // Delete a file
  async deleteFile(fileId: string): Promise<void> {
    try {
      const files = await this.getUserFiles();
      const fileToDelete = files.find(f => f.id === fileId);
      
      if (fileToDelete) {
        // Delete from file system
        await FileSystem.deleteAsync(fileToDelete.uri, { idempotent: true });
        
        // Remove from AsyncStorage
        const updatedFiles = files.filter(f => f.id !== fileId);
        await AsyncStorage.setItem('vestrade_files', JSON.stringify(updatedFiles));
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Clean up orphaned files (files in storage but not in AsyncStorage)
  async cleanupOrphanedFiles(): Promise<void> {
    try {
      const storedFiles = await this.getUserFiles();
      const storedUris = storedFiles.map(f => f.uri);

      // Check screenshots directory
      const screenshots = await FileSystem.readDirectoryAsync(this.screenshotsDir);
      for (const file of screenshots) {
        const fileUri = `${this.screenshotsDir}${file}`;
        if (!storedUris.includes(fileUri)) {
          await FileSystem.deleteAsync(fileUri, { idempotent: true });
        }
      }

      // Check voice notes directory
      const voiceNotes = await FileSystem.readDirectoryAsync(this.voiceNotesDir);
      for (const file of voiceNotes) {
        const fileUri = `${this.voiceNotesDir}${file}`;
        if (!storedUris.includes(fileUri)) {
          await FileSystem.deleteAsync(fileUri, { idempotent: true });
        }
      }
    } catch (error) {
      console.error('Error cleaning up orphaned files:', error);
    }
  }

  // Get file size
  async getFileSize(uri: string): Promise<number> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      return (fileInfo as any).size || 0;
    } catch (error) {
      console.error('Error getting file size:', error);
      return 0;
    }
  }

  // Check if file exists
  async fileExists(uri: string): Promise<boolean> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      return fileInfo.exists;
    } catch (error) {
      return false;
    }
  }

  private async saveFileInfo(fileInfo: FileInfo): Promise<void> {
    try {
      const files = await this.getUserFiles();
      files.push(fileInfo);
      await AsyncStorage.setItem('vestrade_files', JSON.stringify(files));
    } catch (error) {
      console.error('Error saving file info:', error);
    }
  }
}

// Export singleton instance
export const fileManager = new FileManager(); 