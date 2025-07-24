import { Colors } from '@/constants/Colors';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

// Define the shape of your theme context
type ThemeContextType = {
  colorScheme: 'light' | 'dark';
  theme: typeof Colors.light | typeof Colors.dark;
  toggleTheme?: () => void; // Optional: Add if you want manual theme switching
};

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({ 
  colorScheme: 'light',
  theme: Colors.light
});

// Create a provider component
type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Get the device color scheme
  const deviceColorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(deviceColorScheme);
  
  // Update colorScheme when device preference changes
  useEffect(() => {
    setColorScheme(deviceColorScheme);
  }, [deviceColorScheme]);
  
  // Get the theme based on color scheme
  const theme = Colors[colorScheme];
  
  // Optional: Add a function to toggle theme manually
  const toggleTheme = () => {
    setColorScheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ colorScheme, theme, toggleTheme  }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);