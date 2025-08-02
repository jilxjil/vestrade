import ThemedCard from '@/components/ThemedCard';
import ThemedScroll from '@/components/ThemedScroll';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { useTags } from '@/contexts/TagContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, FlatList, TextInput, TouchableOpacity, View } from 'react-native';

const financeQuotes = [
  { q: "Risk comes from not knowing what you’re doing.", a: "Warren Buffett" },
  { q: "The stock market is filled with individuals who know the price of everything, but the value of nothing.", a: "Philip Fisher" },
  { q: "In investing, what is comfortable is rarely profitable.", a: "Robert Arnott" },
  { q: "The four most dangerous words in investing are: 'this time it’s different.'", a: "Sir John Templeton" },
  { q: "Know what you own, and know why you own it.", a: "Peter Lynch" },
  { q: "The goal of a successful trader is to make the best trades. Money is secondary.", a: "Alexander Elder" },
  { q: "Opportunities come infrequently. When it rains gold, put out the bucket, not the thimble.", a: "Warren Buffett" },
  { q: "It’s not whether you’re right or wrong that’s important, but how much money you make when you’re right and how much you lose when you’re wrong.", a: "George Soros" },
  // ...add more as you like
];

function useFinanceQuote() {
  const [quote, setQuote] = useState<{q: string, a: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch('https://api.quotable.io/random?tags=business|success|wisdom')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.content && data.author) {
          setQuote({ q: data.content, a: data.author });
        } else {
          // Fallback to curated finance quote
          const random = financeQuotes[Math.floor(Math.random() * financeQuotes.length)];
          setQuote(random);
        }
      })
      .catch(() => {
        if (isMounted) {
          // Fallback to curated finance quote
          const random = financeQuotes[Math.floor(Math.random() * financeQuotes.length)];
          setQuote(random);
          setError('');
        }
      })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  return { quote, loading, error };
}

const SettingsView = ({ navigation }: any) => {
  const { user, signOut } = useAuth();
  const { theme, colorScheme, toggleTheme } = useTheme();
  const { tags, addTag, editTag, deleteTag } = useTags();
  const [showTags, setShowTags] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: async () => { await signOut(); } },
      ]
    );
  };

  const handleAddTag = async () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      await addTag(newTag.trim());
      setNewTag('');
    }
  };

  const handleEditTag = async () => {
    if (editingTag && editValue.trim() && !tags.includes(editValue.trim())) {
      await editTag(editingTag, editValue.trim());
      setEditingTag(null);
      setEditValue('');
    }
  };

  const handleDeleteTag = async (tag: string) => {
    Alert.alert('Delete Tag', `Delete tag "${tag}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteTag(tag); } }
    ]);
  };

  return (
    <ThemedScroll style={{ backgroundColor: colorScheme === 'dark' ? theme.background : '#F8FAFC' }} className="flex-1 py-10">
      {/* Header */}
      <ThemedView className="p-4 pt-12">
        <ThemedText title className="text-2xl font-bold">Settings</ThemedText>
      </ThemedView>

      {/* User Info */}
      <ThemedView className="px-4 mb-6">
        <ThemedCard className="p-4">
          <View className="flex-row items-center">
            <View 
              style={{ backgroundColor: theme.primary }}
              className="w-12 h-12 rounded-full items-center justify-center mr-4"
            >
              <ThemedText style={{ color: '#FFFFFF' }} className="text-lg font-bold">
                {user?.name?.charAt(0) || 'U'}
              </ThemedText>
            </View>
            <View className="flex-1">
              <ThemedText title className="text-lg font-semibold">
                {user?.name || 'User'}
              </ThemedText>
              <ThemedText style={{ color: theme.text + '80' }} className="text-sm">
                {user?.email || 'user@example.com'}
              </ThemedText>
            </View>
          </View>
        </ThemedCard>
      </ThemedView>

      {/* Tag Management Section */}
      <ThemedView className="px-4 mb-6">
        <ThemedCard>
          <TouchableOpacity
            className="flex-row items-center justify-between p-4"
            onPress={() => setShowTags(!showTags)}
          >
            <View className="flex-row items-center">
              <Ionicons name="pricetags" size={22} color={theme.text} />
              <ThemedText className="ml-3 text-lg">Manage Tags</ThemedText>
            </View>
            <Ionicons name={showTags ? 'chevron-up' : 'chevron-down'} size={20} color={theme.text + '80'} />
          </TouchableOpacity>
          {showTags && (
            <View className="px-4 pb-4">
              {/* Tag List */}
              {tags.length === 0 && <ThemedText className="mb-2">No tags yet.</ThemedText>}
              <FlatList
                data={tags}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <View className="flex-row items-center mb-2">
                    {editingTag === item ? (
                      <>
                        <TextInput
                          value={editValue}
                          onChangeText={setEditValue}
                          style={{
                            backgroundColor: theme.background,
                            color: theme.text,
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            flex: 1,
                            borderWidth: 1,
                            borderColor: theme.uiBackground
                          }}
                          autoFocus
                        />
                        <TouchableOpacity onPress={handleEditTag} className="ml-2"><Ionicons name="checkmark" size={20} color={theme.primary} /></TouchableOpacity>
                        <TouchableOpacity onPress={() => { setEditingTag(null); setEditValue(''); }} className="ml-1"><Ionicons name="close" size={20} color={theme.text + '80'} /></TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <ThemedText style={{ backgroundColor: theme.background, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4, marginRight: 8 }}>{item}</ThemedText>
                        <TouchableOpacity onPress={() => { setEditingTag(item); setEditValue(item); }}><Ionicons name="pencil" size={18} color={theme.primary} /></TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteTag(item)} className="ml-2"><Ionicons name="trash" size={18} color="#EF4444" /></TouchableOpacity>
                      </>
                    )}
                  </View>
                )}
              />
              {/* Add Tag */}
              <View className="flex-row items-center mt-2">
                <TextInput
                  value={newTag}
                  onChangeText={setNewTag}
                  placeholder="Add new tag"
                  placeholderTextColor={theme.text + '80'}
                  style={{
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    flex: 1,
                    borderWidth: 1,
                    borderColor: theme.uiBackground
                  }}
                />
                <TouchableOpacity onPress={handleAddTag} className="ml-2">
                  <Ionicons name="add-circle" size={28} color={theme.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ThemedCard>
      </ThemedView>

      {/* Settings Options */}
      <ThemedView className="px-4">
        {/* Theme Toggle */}
        <ThemedCard className="mb-4">
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4"
            onPress={toggleTheme}
          >
            <View className="flex-row items-center">
              <Ionicons 
                name={colorScheme === 'dark' ? 'moon' : 'sunny'} 
                size={24} 
                color={theme.text} 
              />
              <ThemedText className="ml-3 text-lg">Theme</ThemedText>
            </View>
            <ThemedText style={{ color: theme.text + '80' }}>
              {colorScheme === 'dark' ? 'Dark' : 'Light'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedCard>

        {/* Account Settings */}
        <ThemedCard className="mb-4">
          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <Ionicons name="person" size={24} color={theme.text} />
              <ThemedText className="ml-3 text-lg">Account</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '80'} />
          </TouchableOpacity>
        </ThemedCard>

        {/* Notifications */}
        <ThemedCard className="mb-4">
          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <Ionicons name="notifications" size={24} color={theme.text} />
              <ThemedText className="ml-3 text-lg">Notifications</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '80'} />
          </TouchableOpacity>
        </ThemedCard>

        {/* Privacy */}
        <ThemedCard className="mb-4">
          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <Ionicons name="shield" size={24} color={theme.text} />
              <ThemedText className="ml-3 text-lg">Privacy</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '80'} />
          </TouchableOpacity>
        </ThemedCard>

        {/* Help & Support */}
        <ThemedCard className="mb-4">
          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <Ionicons name="help-circle" size={24} color={theme.text} />
              <ThemedText className="ml-3 text-lg">Help & Support</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '80'} />
          </TouchableOpacity>
        </ThemedCard>

        {/* About */}
        <ThemedCard className="mb-4">
          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <Ionicons name="information-circle" size={24} color={theme.text} />
              <ThemedText className="ml-3 text-lg">About</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + '80'} />
          </TouchableOpacity>
        </ThemedCard>

        {/* Logout */}
        <ThemedCard className="mb-4">
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4"
            onPress={handleLogout}
          >
            <View className="flex-row items-center">
              <Ionicons name="log-out" size={24} color="#EF4444" />
              <ThemedText style={{ color: '#EF4444' }} className="ml-3 text-lg">
                Logout
              </ThemedText>
    </View>
            <Ionicons name="chevron-forward" size={20} color="#EF4444" />
          </TouchableOpacity>
        </ThemedCard>
      </ThemedView>
    </ThemedScroll>
  );
};

export default SettingsView;