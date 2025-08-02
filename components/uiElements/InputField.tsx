import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import React, { useState } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import ThemedText from '../ThemedText';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const InputField = ({ 
  label, 
  error, 
  leftIcon, 
  rightIcon, 
  style, 
  ...props 
}: InputFieldProps) => {
  const { theme, colorScheme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      <ThemedText className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        {label}
      </ThemedText>
      <View className="relative">
        {leftIcon && (
          <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
            {leftIcon}
          </View>
        )}
        <TextInput
          className={`px-4 py-3 rounded-xl border text-base ${
            leftIcon ? 'pl-12' : ''
          } ${rightIcon ? 'pr-12' : ''}`}
          style={[
            {
              backgroundColor: theme.uiBackground,
              color: theme.text,
              borderColor: error 
                ? '#EF4444' 
                : isFocused 
                  ? Colors.primary 
                  : colorScheme === 'dark' ? '#374151' : '#E5E7EB',
              borderWidth: 1,
            },
            style
          ]}
          placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && (
          <View className="absolute right-3 top-0 bottom-0 justify-center z-10">
            {rightIcon}
          </View>
        )}
      </View>
      {error && (
        <ThemedText className="text-sm text-red-500 mt-1">{error}</ThemedText>
      )}
    </View>
  );
};

export default InputField; 