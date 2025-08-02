import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import "../global.css";

export default function Index() {
  const { theme, colorScheme } = useTheme();

  return (
    <ThemedView className="flex-1">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Background */}
      <LinearGradient
        colors={
          colorScheme === 'dark' 
            ? ['#0F172A', '#1E293B', '#334155']
            : ['#FFFFFF', '#F8FAFC', '#F1F5F9']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="p-6 pt-16">
          <View className="flex-row items-center justify-between">
            <View>
              <ThemedText className="text-3xl font-black tracking-wider text-teal-600">
                VESTRADE
              </ThemedText>
              <View className="flex-row mt-1 space-x-1">
                <View className="w-2 h-2 bg-teal-500 rounded-full" />
                <View className="w-2 h-2 bg-teal-400 rounded-full" />
                <View className="w-2 h-2 bg-teal-300 rounded-full" />
              </View>
            </View>
            
            <View className="flex-row space-x-2">
              <View className="w-8 h-8 rounded-full items-center justify-center bg-teal-100">
                <Ionicons name="trending-up" size={16} color="#06B6D4" />
              </View>
              <View className="w-8 h-8 rounded-full items-center justify-center bg-teal-100">
                <Ionicons name="book" size={16} color="#06B6D4" />
              </View>
            </View>
          </View>
        </View>

        {/* Hero Section */}
        <View className="px-6 mb-12">
          <View className="items-center mb-8">
            <View className="w-20 h-20 rounded-full items-center justify-center mb-6"
                  style={{ backgroundColor: Colors.primary + '20' }}>
              <Ionicons name="analytics" size={32} color={Colors.primary} />
      </View>

            <ThemedText 
              className="text-4xl font-black text-center mb-2 leading-tight"
              style={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' }}
            >
              Master Your
            </ThemedText>
            <ThemedText 
              className="text-4xl font-black text-center mb-4 leading-tight"
              style={{ color: Colors.primary }}
            >
              Trading Psychology
            </ThemedText>
            
            <ThemedText 
              className="text-lg text-center leading-relaxed px-4"
              style={{ color: colorScheme === 'dark' ? '#D1D5DB' : '#6B7280' }}
            >
              Transform your trading with intelligent journaling, emotional tracking, and data-driven insights.
            </ThemedText>
          </View>
        </View>

        {/* Features Section */}
        <View className="px-6 mb-12">
          <ThemedText 
            className="text-xl font-bold text-center mb-8"
            style={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' }}
          >
            Everything You Need to Succeed
          </ThemedText>
          
          <View className="space-y-4">
            <View className="flex-row items-center p-4 rounded-2xl"
                  style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F8FAFC' }}>
              <View className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                    style={{ backgroundColor: Colors.primary + '20' }}>
                <Ionicons name="trending-up" size={24} color={Colors.primary} />
              </View>
              <View className="flex-1">
                <ThemedText 
                  className="text-lg font-semibold mb-1"
                  style={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  Advanced Analytics
                </ThemedText>
                <ThemedText 
                  className="text-sm"
                  style={{ color: colorScheme === 'dark' ? '#D1D5DB' : '#6B7280' }}
                >
                  Track performance, win rates, and patterns
                </ThemedText>
              </View>
            </View>

            <View className="flex-row items-center p-4 rounded-2xl"
                  style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F8FAFC' }}>
              <View className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                    style={{ backgroundColor: Colors.primary + '20' }}>
                <Ionicons name="calendar" size={24} color={Colors.primary} />
              </View>
              <View className="flex-1">
                <ThemedText 
                  className="text-lg font-semibold mb-1"
                  style={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  Trade Calendar
                </ThemedText>
                <ThemedText 
                  className="text-sm"
                  style={{ color: colorScheme === 'dark' ? '#D1D5DB' : '#6B7280' }}
                >
                  Visualize your trading history and patterns
                </ThemedText>
              </View>
            </View>

            <View className="flex-row items-center p-4 rounded-2xl"
                  style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F8FAFC' }}>
              <View className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                    style={{ backgroundColor: Colors.primary + '20' }}>
                <Ionicons name="mic" size={24} color={Colors.primary} />
              </View>
              <View className="flex-1">
                <ThemedText 
                  className="text-lg font-semibold mb-1"
                  style={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  Voice Journaling
                </ThemedText>
                <ThemedText 
                  className="text-sm"
                  style={{ color: colorScheme === 'dark' ? '#D1D5DB' : '#6B7280' }}
                >
                  Record your thoughts and emotions instantly
        </ThemedText>
              </View>
            </View>
          </View>
        </View>

        

        {/* CTA Section */}
        <View className="px-6 pb-8">
          <View className="space-y-4">
        <Link href="/(auth)/signup" asChild>
          <Pressable 
                className="py-5 rounded-2xl items-center"
                style={{ 
                  backgroundColor: Colors.primary,
                  shadowColor: Colors.primary,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 8,
                }}
              >
                <Text className="text-white text-xl font-bold">Start Trading Smarter</Text>
               
          </Pressable>
        </Link>
        
        <Link href="/(auth)/login" asChild>
              <Pressable className="py-4 rounded-2xl items-center">
                <ThemedText 
                  className="text-lg font-semibold"
                  style={{ color: Colors.primary }}
                >
                  I already have an account
                </ThemedText>
          </Pressable>
        </Link>
      </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}