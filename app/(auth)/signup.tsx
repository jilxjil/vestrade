import ThemedBackground from "@/components/ThemedBackground";
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
 
export default function Signup() {
  const { theme, colorScheme } = useTheme();
  const { signUp, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ 
    name?: string; 
    email?: string; 
    password?: string; 
    confirmPassword?: string; 
    general?: string 
  }>({});

  const validateForm = () => {
    const newErrors: { 
      name?: string; 
      email?: string; 
      password?: string; 
      confirmPassword?: string; 
    } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    setErrors({});
    const result = await signUp(name, email, password);
    if (result.success) {
      router.replace('/navigation/navBar');
    } else {
      setErrors({ general: result.error || 'Sign up failed' });
    }
  };

  return (
    <ThemedView className="flex-1 relative">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Back Button */}
      <Pressable 
        className="absolute top-12 left-6 z-20 p-[1.5px] rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
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
      <View className="flex-1 justify-center px-6 pt-8 mt-3">
        <View className="p-6 rounded-3xl shadow-2xl" style={{ backgroundColor: theme.uiBackground }}>
          {/* Header */}
          <View className="items-center mb-6">
            <View className="w-14 h-14 rounded-full items-center justify-center mb-3"
                  style={{ backgroundColor: colorScheme === 'dark' ? '#374151' : '#F3F4F6' }}>
              <Ionicons name="person-add" size={28} color={Colors.primary} />
            </View>
            <ThemedText className="text-2xl font-bold text-center">Create Account</ThemedText>
            <ThemedText className="text-sm text-center mt-1 opacity-70">
              Join us to start your trading journey
            </ThemedText>
          </View>

          {/* Form */}
          <View className="space-y-3">
            <InputField
              label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
              autoComplete="name"
              leftIcon={<Ionicons name="person-outline" size={20} color="#6B7280" />}
              error={errors.name}
            />

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
              placeholder="Create a strong password"
            value={password}
            onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="new-password"
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

            <InputField
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoComplete="new-password"
              leftIcon={<Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />}
              rightIcon={
                <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </Pressable>
              }
              error={errors.confirmPassword}
            />

            {/* Password Requirements */}
            <View className="p-3 rounded-lg" style={{ backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F9FAFB' }}>
              <ThemedText className="text-sm font-medium mb-2">Password Requirements:</ThemedText>
              <View className="space-y-1">
                <View className="flex-row items-center">
                  <Ionicons 
                    name={password.length >= 8 ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={password.length >= 8 ? "#10B981" : "#6B7280"} 
                  />
                  <ThemedText className="text-xs ml-2">At least 8 characters</ThemedText>
                </View>
                <View className="flex-row items-center">
                  <Ionicons 
                    name={/(?=.*[a-z])/.test(password) ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={/(?=.*[a-z])/.test(password) ? "#10B981" : "#6B7280"} 
                  />
                  <ThemedText className="text-xs ml-2">One lowercase letter</ThemedText>
                </View>
                <View className="flex-row items-center">
                  <Ionicons 
                    name={/(?=.*[A-Z])/.test(password) ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={/(?=.*[A-Z])/.test(password) ? "#10B981" : "#6B7280"} 
                  />
                  <ThemedText className="text-xs ml-2">One uppercase letter</ThemedText>
                </View>
                <View className="flex-row items-center">
                  <Ionicons 
                    name={/(?=.*\d)/.test(password) ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={/(?=.*\d)/.test(password) ? "#10B981" : "#6B7280"} 
                  />
                  <ThemedText className="text-xs ml-2">One number</ThemedText>
                </View>
              </View>
        </View>

            {/* General Error */}
            {errors.general && (
              <View className="p-3 rounded-xl mb-3" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <ThemedText className="text-center text-red-500 text-sm">{errors.general}</ThemedText>
              </View>
            )}
        
        {/* Sign Up Button */}
            <AuthButton
              title="Create Account"
              loading={isLoading}
              onPress={handleSignup}
              size="lg"
            />

            {/* Divider */}
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px" style={{ backgroundColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB' }} />
              <ThemedText className="mx-4 text-sm opacity-60">or</ThemedText>
              <View className="flex-1 h-px" style={{ backgroundColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB' }} />
            </View>
        
        {/* Login Link */}
            <View className="items-center">
              <ThemedText className="text-sm opacity-70">
                Already have an account?{' '}
                <Link href="/(auth)/login" asChild>
          <Pressable>
                    <ThemedText className="text-teal-600 dark:text-teal-400 font-semibold">
                      Sign in
                    </ThemedText>
          </Pressable>
        </Link>
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}