import ThemedText from '@/components/ThemedText'
import ThemedView from '@/components/ThemedView'
import InputField from '@/components/uiElements/InputField'
import JournalTab from '@/components/uiElements/JournalTab'
import { useTheme } from '@/contexts/ThemeContext'
import { useTrades } from '@/contexts/TradeContext'
import { useState } from 'react'
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native'

const AddTradeView = () => {
  const { theme } = useTheme()
  const { addTrade } = useTrades()
  const [activeTab, setActiveTab] = useState<'general' | 'journal'>('general')
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [selectedEmotion, setSelectedEmotion] = useState('neutral')
  const [voiceNoteUri, setVoiceNoteUri] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [formData, setFormData] = useState({
    symbol: '',
    entryPrice: '',
    target: '',
    stopLoss: '',
    quantity: '',
    fee: '0'
  })

  // Move components inside to ensure proper context access
  const SegmentedControl = ({ 
    options, 
    value, 
    onValueChange, 
    className = ""
  }: {
    options: { label: string; value: string }[]
    value: string
    onValueChange: (value: string) => void
    className?: string
  }) => (
    <View style={{ backgroundColor: theme.uiBackground }} className={`flex-row rounded-lg p-1 ${className}`}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          className={`flex-1 py-2 px-4 rounded-md ${
            value === option.value ? 'shadow-sm' : ''
          }`}
          style={{
            backgroundColor: value === option.value ? theme.background : 'transparent'
          }}
          onPress={() => onValueChange(option.value)}
        >
          <ThemedText className={`text-center font-medium ${
            value === option.value ? 'title' : ''
          }`}>
            {option.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  )

  const TradeTypeToggle = ({ value, onValueChange }: { value: 'buy' | 'sell'; onValueChange: (v: 'buy' | 'sell') => void }) => (
    <View className="flex-row rounded-lg overflow-hidden mb-4">
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: value === 'buy' ? '#10B981' : theme.uiBackground, paddingVertical: 14, alignItems: 'center' }}
        onPress={() => onValueChange('buy')}
      >
        <ThemedText style={{ color: value === 'buy' ? '#fff' : theme.text, fontWeight: 'bold', fontSize: 16 }}>Buy</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: value === 'sell' ? '#EF4444' : theme.uiBackground, paddingVertical: 14, alignItems: 'center' }}
        onPress={() => onValueChange('sell')}
      >
        <ThemedText style={{ color: value === 'sell' ? '#fff' : theme.text, fontWeight: 'bold', fontSize: 16 }}>Sell</ThemedText>
      </TouchableOpacity>
    </View>
  )

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setActiveTab('general')
    setTradeType('buy')
    setSelectedEmotion('neutral')
    setVoiceNoteUri(null)
    setNotes('')
    setScreenshots([])
    setSelectedTags([])
    setFormData({
      symbol: '',
      entryPrice: '',
      target: '',
      stopLoss: '',
      quantity: '',
      fee: '0'
    })
  }

  const handleSaveTrade = () => {
    // Validate required fields
    if (!formData.symbol || !formData.entryPrice || !formData.target || !formData.stopLoss || !formData.quantity) {
      alert('Please fill in all required fields')
      return
    }

    const trade = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      symbol: formData.symbol,
      direction: tradeType === 'buy' ? 'Long' : 'Short' as 'Long' | 'Short',
      entryPrice: parseFloat(formData.entryPrice),
      quantity: parseFloat(formData.quantity),
      stopLoss: parseFloat(formData.stopLoss),
      takeProfit: parseFloat(formData.target),
      status: 'open' as 'open', // Create as open trade
      tags: selectedTags, // Include selected tags
      emotion: selectedEmotion as any,
      voiceNoteUri: voiceNoteUri || undefined,
      notes: notes || undefined,
      screenshots: screenshots.length > 0 ? screenshots : undefined,
    }

    addTrade(trade)
    resetForm() // Reset the form and stay on the same screen
  }

  return (
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Header */}
        <ThemedView className="mb-6">
          <ThemedText title className="text-2xl font-bold mb-4">
            Trade Entry
          </ThemedText>
          {/* Tab Navigation */}
          <SegmentedControl
            options={[
              { label: 'General', value: 'general' },
              { label: 'Journal', value: 'journal' }
            ]}
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'general' | 'journal')}
            className="mb-6"
          />
        </ThemedView>

        {/* General Tab - always mounted, toggled by display */}
        <View style={{ display: activeTab === 'general' ? 'flex' : 'none' }}>
          <ThemedView>
            {/* Trade Type */}
            <ThemedView className="mb-6">
              <ThemedText className="text-sm font-medium mb-2">Trade Type</ThemedText>
              <TradeTypeToggle value={tradeType} onValueChange={setTradeType} />
            </ThemedView>

            {/* Modern Trade Details Layout */}
            <ThemedView className="mb-6">
              <InputField
                label="Symbol"
                value={formData.symbol}
                onChangeText={(text) => updateFormData('symbol', text)}
                placeholder="e.g., EUR/USD"
              />
              <InputField
                label="Entry Price"
                value={formData.entryPrice}
                onChangeText={(text) => updateFormData('entryPrice', text)}
                placeholder="0.0000"
                keyboardType="decimal-pad"
              />
              <InputField
                label="Take Profit"
                value={formData.target}
                onChangeText={(text) => updateFormData('target', text)}
                placeholder="0.0000"
                keyboardType="decimal-pad"
              />
              <InputField
                label="Stop Loss"
                value={formData.stopLoss}
                onChangeText={(text) => updateFormData('stopLoss', text)}
                placeholder="0.0000"
                keyboardType="decimal-pad"
              />
              <InputField
                label="Quantity (Lots)"
                value={formData.quantity}
                onChangeText={(text) => updateFormData('quantity', text)}
                placeholder="0.01"
                keyboardType="decimal-pad"
              />
              <InputField
                label="Fee"
                value={formData.fee}
                onChangeText={(text) => updateFormData('fee', text)}
                placeholder="0"
                keyboardType="decimal-pad"
              />
            </ThemedView>
          </ThemedView>
        </View>

        {/* Journal Tab - always mounted, toggled by display */}
        <View style={{ display: activeTab === 'journal' ? 'flex' : 'none' }}>
          <JournalTab
            selectedEmotion={selectedEmotion}
            onEmotionSelect={setSelectedEmotion}
            voiceNoteUri={voiceNoteUri}
            onVoiceNoteChange={setVoiceNoteUri}
            notes={notes || ''}
            onNotesChange={setNotes}
            screenshots={screenshots}
            onScreenshotsChange={setScreenshots}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className="bg-teal-500 py-4 rounded-lg mb-6"
          onPress={handleSaveTrade}
        >
          <ThemedText className="text-white text-center font-semibold text-lg">
            Save Trade
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddTradeView