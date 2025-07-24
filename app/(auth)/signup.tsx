import ThemedBackground from "@/components/ThemedBackground";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, StatusBar, TextInput, View } from "react-native";
import "../../global.css";
 
export default function Signup() {
 
  const {theme,colorScheme} = useTheme();
  const [name, setName] = useState('');
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
        <ThemedText className="text-3xl font-bold mb-10">Create Account</ThemedText>
        
        {/* Name Input */}
        <View className="mb-6">
          <ThemedText className="mb-2">Full Name</ThemedText>
          <TextInput
            className="p-4 rounded-lg mb-1"
            style={{ 
              backgroundColor: theme.uiBackground,
              color: theme.text
            }}
            placeholder="Enter your full name"
            placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
            value={name}
            onChangeText={setName}
          />
        </View>
        
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
            placeholder="Create a password"
            placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <ThemedText className="text-sm text-gray-500">Must be at least 8 characters</ThemedText>
        </View>
        
        {/* Sign Up Button */}
        <Pressable 
          className="bg-teal-500 py-4 rounded-lg items-center mb-6"
          style={{ backgroundColor: Colors.primary }}
          onPress={()=>{router.push('/navigation/navBar')}}
        >
          <ThemedText title={true} className="text-white text-xl font-semibold">Create Account</ThemedText>
        </Pressable>
        
        {/* Login Link */}
        <Link href="/login" asChild>
          <Pressable>
            <ThemedText className="text-center">Already have an account? Log in</ThemedText>
          </Pressable>
        </Link>
      </View>
    </ThemedView>
  );
}