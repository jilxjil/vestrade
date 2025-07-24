import ThemedBackground from "@/components/ThemedBackground";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { Pressable, StatusBar, useColorScheme, View } from "react-native";
import "../global.css";

export default function Index() {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = Colors[colorScheme];

  return (
    <ThemedView className="flex-1 relative">
      
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View className="p-6 pt-16">
        <ThemedText className="text-3xl font-bold tracking-wider text-teal-500">VESTRADE</ThemedText>
        <View className="flex-row mt-1 space-x-2">
          <View className="w-4 h-4 bg-teal-500 rounded-full opacity-70 mr-2" />
          <View className="w-4 h-4 bg-teal-500 rounded-full opacity-70 mr-2" />
          <View className="w-4 h-4 bg-teal-500 rounded-full opacity-70 "  />
        </View>
      </View>

      <ThemedBackground
        lightSource={require('../assets/images/Refletion.jpg')}
        darkSource={require('../assets/images/Perspective.jpg')}
      />

      {/* Main Content */}
      <View className="flex-1 justify-end p-8 pb-32">
        <ThemedText className="text-5xl font-bold mb-1 text-white">Clarity</ThemedText>
        <ThemedText className="text-5xl font-bold mb-1">Before</ThemedText>
        <ThemedText className="text-5xl font-bold mb-8">Every Trade.</ThemedText>
        
        <ThemedText className="text-2xl font-semibold mb-6">Explore.</ThemedText>
        
        <ThemedText className="text-lg mb-10">
          Invest in your mindset. Trade with clarity.
        </ThemedText>
        
        {/* Sign Up Button */}
        <Link href="/(auth)/signup" asChild>
          <Pressable 
            className="bg-teal-500 py-4 rounded-lg items-center mb-4"
            style={{ backgroundColor: Colors.primary }}
          >
            <ThemedText title={true} className="text-white text-xl font-semibold">Sign Up</ThemedText>
          </Pressable>
        </Link>
        
        {/* Login Link */}
        <Link href="/(auth)/login" asChild>
          <Pressable>
            <ThemedText className="text-center">Already have an account? Log in</ThemedText>
          </Pressable>
        </Link>
      </View>
    </ThemedView>
  );
}