import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useTheme } from '@/contexts/ThemeContext';
import { useTrades } from '@/contexts/TradeContext';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useState } from 'react';
import { Alert, Dimensions, Pressable, ScrollView, TextInput, View } from 'react-native';

const { width } = Dimensions.get('window');

const TradeDetailsView = ({ route, navigation }: any) => {
  const { theme } = useTheme();
  const { updateTrade, closeTrade } = useTrades();
  const trade = route.params?.trade || {};
  
  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrade, setEditedTrade] = useState(trade);
  const [exitPrice, setExitPrice] = useState('');

  const getEmotionIcon = (emotion: string) => {
    const emotionIcons: { [key: string]: string } = {
      confident: '😤',
      excited: '🤩',
      calm: '😌',
      neutral: '😐',
      nervous: '😰',
      anxious: '😨',
      frustrated: '😤'
    };
    return emotionIcons[emotion] || '😐';
  };

  const playVoiceNote = async () => {
    if (!trade.voiceNoteUri) return;
    
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: trade.voiceNoteUri });
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing voice note:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateTrade(trade.id, editedTrade);
      setIsEditing(false);
      Alert.alert('Success', 'Trade updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update trade');
    }
  };

  const handleCloseTrade = async () => {
    if (!exitPrice || isNaN(parseFloat(exitPrice))) {
      Alert.alert('Error', 'Please enter a valid exit price');
      return;
    }

    try {
      await closeTrade(trade.id, parseFloat(exitPrice));
      Alert.alert('Success', 'Trade closed successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to close trade');
    }
  };

  const isOpenTrade = trade.status === 'open';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <ThemedView className="px-4 pt-12 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <ThemedText title className="text-2xl font-bold">
            {isOpenTrade ? 'Open Trade' : 'Trade Details'}
          </ThemedText>
          {isOpenTrade && (
            <View className="flex-row space-x-2">
              <Pressable
                onPress={() => setIsEditing(!isEditing)}
                className="bg-blue-500 px-3 py-1 rounded-lg"
              >
                <ThemedText className="text-white text-sm font-medium">
                  {isEditing ? 'Cancel' : 'Edit'}
                </ThemedText>
              </Pressable>
              {isEditing && (
                <Pressable
                  onPress={handleSaveEdit}
                  className="bg-green-500 px-3 py-1 rounded-lg"
                >
                  <ThemedText className="text-white text-sm font-medium">Save</ThemedText>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </ThemedView>

      {/* Trade Information */}
      <ThemedView className="px-4 mb-6">
        <ThemedText title className="text-lg font-bold mb-2">Trade Information</ThemedText>
        <View style={{ backgroundColor: theme.uiBackground, borderRadius: 4, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, borderColor: theme.background + '33' }}>
            <ThemedText style={{ fontWeight: '500', fontSize: 16 }}>Asset</ThemedText>
            {isEditing ? (
              <TextInput
                value={String(editedTrade.symbol || '')}
                onChangeText={(text) => setEditedTrade((prev: any) => ({ ...prev, symbol: text }))}
                style={{ backgroundColor: theme.background, color: theme.text, borderWidth: 1, borderColor: theme.uiBackground, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4, fontSize: 16, minWidth: 100, textAlign: 'right' }}
              />
            ) : (
              <ThemedText style={{ fontSize: 16 }}>{editedTrade.symbol}</ThemedText>
            )}
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, borderColor: theme.background + '33' }}>
            <ThemedText style={{ fontWeight: '500', fontSize: 16 }}>Entry Price</ThemedText>
            {isEditing ? (
              <TextInput
                value={String(editedTrade.entryPrice || '')}
                onChangeText={(text) => setEditedTrade((prev: any) => ({ ...prev, entryPrice: text }))}
                keyboardType="decimal-pad"
                style={{ backgroundColor: theme.background, color: theme.text, borderWidth: 1, borderColor: theme.uiBackground, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4, fontSize: 16, minWidth: 100, textAlign: 'right' }}
              />
            ) : (
              <ThemedText style={{ fontSize: 16 }}>{editedTrade.entryPrice}</ThemedText>
            )}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, borderColor: theme.background + '33' }}>
            <ThemedText style={{ fontWeight: '500', fontSize: 16 }}>Quantity</ThemedText>
            {isEditing ? (
              <TextInput
                value={String(editedTrade.quantity || '')}
                onChangeText={(text) => setEditedTrade((prev: any) => ({ ...prev, quantity: text }))}
                keyboardType="decimal-pad"
                style={{ backgroundColor: theme.background, color: theme.text, borderWidth: 1, borderColor: theme.uiBackground, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4, fontSize: 16, minWidth: 100, textAlign: 'right' }}
              />
            ) : (
              <ThemedText style={{ fontSize: 16 }}>{editedTrade.quantity}</ThemedText>
            )}
          </View>

          {!isOpenTrade && (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, borderColor: theme.background + '33' }}>
                <ThemedText style={{ fontWeight: '500', fontSize: 16 }}>Exit Price</ThemedText>
                <ThemedText style={{ fontSize: 16 }}>{editedTrade.exitPrice}</ThemedText>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, borderColor: theme.background + '33' }}>
                <ThemedText style={{ fontWeight: '500', fontSize: 16 }}>Result</ThemedText>
                <ThemedText style={{ fontSize: 16 }}>{editedTrade.result}</ThemedText>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12 }}>
                <ThemedText style={{ fontWeight: '500', fontSize: 16 }}>PnL</ThemedText>
                <ThemedText style={{ fontSize: 16 }}>${editedTrade.pnl?.toFixed(2) || '0.00'}</ThemedText>
              </View>
            </>
          )}
        </View>
      </ThemedView>

      {/* Close Trade Section for Open Trades */}
      {isOpenTrade && (
        <ThemedView className="px-4 mb-6">
          <ThemedText title className="text-lg font-bold mb-2">Close Trade</ThemedText>
          <View style={{ backgroundColor: theme.uiBackground, borderRadius: 4, padding: 12 }}>
            <View className="flex-row items-center space-x-3 mb-3">
              <ThemedText className="text-base font-medium">Exit Price:</ThemedText>
              <TextInput
                value={exitPrice}
                onChangeText={setExitPrice}
                placeholder="Enter exit price"
                keyboardType="decimal-pad"
                style={{
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderWidth: 1,
                  borderColor: theme.uiBackground,
                  borderRadius: 4,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  fontSize: 16,
                  flex: 1
                }}
                placeholderTextColor={theme.text + '80'}
              />
            </View>
            <Pressable
              onPress={handleCloseTrade}
              className="bg-red-500 py-3 rounded-lg items-center"
            >
              <ThemedText className="text-white font-semibold text-lg">Close Trade</ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      )}

      {/* Emotional State */}
      {editedTrade.emotion && (
        <ThemedView className="px-4 mb-6">
          <ThemedText title className="text-lg font-bold mb-2">Emotional State</ThemedText>
          <View style={{ backgroundColor: theme.uiBackground, borderRadius: 4, padding: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText style={{ fontSize: 24, marginRight: 12 }}>
                {getEmotionIcon(editedTrade.emotion)}
              </ThemedText>
              <ThemedText style={{ fontSize: 16, textTransform: 'capitalize' }}>
                {editedTrade.emotion}
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      )}

      {/* Voice Note */}
      {editedTrade.voiceNoteUri && (
        <ThemedView className="px-4 mb-6">
          <ThemedText title className="text-lg font-bold mb-2">Voice Note</ThemedText>
          <View style={{ backgroundColor: theme.uiBackground, borderRadius: 4, padding: 12 }}>
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={playVoiceNote}
            >
              <Ionicons name="play-circle" size={32} color={theme.primary} />
              <ThemedText style={{ marginLeft: 12, fontSize: 16 }}>
                Play Voice Note
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      )}

      {/* Notes */}
      {editedTrade.notes && (
        <ThemedView className="px-4 mb-6">
          <ThemedText title className="text-lg font-bold mb-2">Notes</ThemedText>
          <View style={{ backgroundColor: theme.uiBackground, borderRadius: 4, padding: 12 }}>
            <ThemedText style={{ fontSize: 16, lineHeight: 24 }}>
              {editedTrade.notes}
            </ThemedText>
          </View>
        </ThemedView>
      )}

      {/* Tags */}
      {editedTrade.tags && editedTrade.tags.length > 0 && (
        <ThemedView className="px-4 mb-6">
          <ThemedText title className="text-lg font-bold mb-2">Tags</ThemedText>
          <View className="flex-row flex-wrap">
            {editedTrade.tags.map((tag: string, index: number) => (
              <View
                key={index}
                style={{
                  backgroundColor: theme.primary + '20',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  marginRight: 8,
                  marginBottom: 8,
                }}
              >
                <ThemedText style={{ color: theme.primary, fontSize: 14, fontWeight: '500' }}>
                  {tag}
                </ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>
      )}
    </ScrollView>
  );
};

export default TradeDetailsView;