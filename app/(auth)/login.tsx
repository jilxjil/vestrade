import ThemedBackground from "@/components/ThemedBackground";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, StatusBar, TextInput, useColorScheme, View } from "react-native";
import "../../global.css";
 
export default function Login() {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = Colors[colorScheme];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ThemedView className="flex-1 relative">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Back Button */}
      <Pressable 
        className="p-6 pt-12" 
        onPress={() => router.back()}
      >
        <ThemedText className="text-lg">← Back</ThemedText>
      </Pressable>
      <ThemedBackground
        lightSource={require('../../assets/images/Perspective2.jpg')}
        darkSource={require('../../assets/images/Perspective.jpg')}
      />
      {/* Main Content */}
      <View className="flex-1 justify-center p-8">
        <ThemedText className="text-3xl font-bold mb-10">Log in</ThemedText>
        
        {/* Email Input */}
        <View className="mb-6">
          <ThemedText className="mb-2">Email</ThemedText>
          <TextInput
            className="p-4 rounded-lg mb-1"
            style={{ 
              backgroundColor: theme.uiBackground,
              color: theme.text
            }}
            placeholder="Enter your email"
            placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        {/* Password Input */}
        <View className="mb-8">
          <ThemedText className="mb-2">Password</ThemedText>
          <TextInput
            className="p-4 rounded-lg mb-1"
            style={{ 
              backgroundColor: theme.uiBackground,
              color: theme.text
            }}
            placeholder="Enter your password"
            placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <ThemedText className="text-right text-sm text-teal-500">Forgot password?</ThemedText>
        </View>
        
        {/* Login Button */}
        <Pressable 
          className="bg-teal-500 py-4 rounded-lg items-center mb-6"
          style={{ backgroundColor: Colors.primary }}
        >
          <ThemedText className="text-white text-xl font-semibold " title={true}>Log in</ThemedText>
        </Pressable>
        
        {/* Sign Up Link */}
        <Link href="/" asChild> 
          <Pressable>
            <ThemedText className="text-center">Don't have an account? Sign up</ThemedText>
          </Pressable>
        </Link>
      </View>
    </ThemedView>
  );
}