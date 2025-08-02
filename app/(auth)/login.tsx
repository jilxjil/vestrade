import ThemedBackground from "@/components/ThemedBackground";
import ThemedCard from "@/components/ThemedCard";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import AuthButton from "@/components/uiElements/AuthButton";
import InputField from "@/components/uiElements/InputField";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, StatusBar, View } from "react-native";
import "../../global.css";
 
export default function Login() {
  const { theme, colorScheme } = useTheme();
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setErrors({});
    const result = await signIn(email, password);
    if (result.success) {
      router.replace('/navigation/navBar');
    } else {
      setErrors({ general: result.error || 'Login failed' });
    }
  };

  return (
    <ThemedView className="flex-1 relative">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Back Button */}
      <Pressable 
        className="absolute top-12 left-6 z-20 p-2 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
        onPress={() => router.back()}
      >
        <Ionicons 
          name="arrow-back" 
          size={24} 
          color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'} 
        />
      </Pressable>

      <ThemedBackground
        lightSource={require('../../assets/images/Refletion.jpg')}
        darkSource={require('../../assets/images/Perspective.jpg')}
      />

      {/* Main Content */}
      <View className="flex-1 justify-center px-6">
        <ThemedCard className="p-8 rounded-3xl shadow-2xl">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-full items-center justify-center mb-4"
                  style={{ backgroundColor: theme.uiBackground }}>
              <Ionicons name="person" size={32} color={Colors.primary} />
            </View>
            <ThemedText className="text-3xl font-bold text-center">Welcome Back</ThemedText>
            <ThemedText className="text-base text-center mt-2 opacity-70">
              Sign in to continue your trading journey
            </ThemedText>
          </View>

          {/* Form */}
          <View className="space-y-4">
            <InputField
              label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
              autoComplete="email"
              leftIcon={<Ionicons name="mail-outline" size={20} color="#6B7280" />}
              error={errors.email}
            />

            <InputField
              label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#6B7280" />}
              rightIcon={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </Pressable>
              }
              error={errors.password}
            />

            {/* Forgot Password */}
            <Pressable className="self-end mb-6">
              <ThemedText className="text-sm text-teal-600 dark:text-teal-400 font-medium">
                Forgot password?
              </ThemedText>
            </Pressable>

            {/* General Error */}
            {errors.general && (
              <View className="p-4 rounded-xl mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <ThemedText className="text-center text-red-500">{errors.general}</ThemedText>
        </View>
            )}
        
        {/* Login Button */}
            <AuthButton
              title="Sign In"
              loading={isLoading}
              onPress={handleLogin}
              size="lg"
            />

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px" style={{ backgroundColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB' }} />
              <ThemedText className="mx-4 text-sm opacity-60">or</ThemedText>
              <View className="flex-1 h-px" style={{ backgroundColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB' }} />
            </View>
        
        {/* Sign Up Link */}
            <View className="items-center">
              <ThemedText className="text-base opacity-70">
                Don't have an account?{' '}
                <Link href="/(auth)/signup" asChild>
          <Pressable>
                    <ThemedText className="text-teal-600 dark:text-teal-400 font-semibold">
                      Sign up
                    </ThemedText>
          </Pressable>
        </Link>
              </ThemedText>
            </View>
          </View>
        </ThemedCard>
      </View>
    </ThemedView>
  );
}