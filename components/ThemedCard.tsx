
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
type ThemedCardProps = ViewProps & {
    style?: StyleProp<ViewStyle>;
    lightColor? : string;
    darkColor?: string;
}

const ThemedCard = ({style, lightColor, darkColor, ...props}:ThemedCardProps) => {
   
    const {theme,colorScheme} = useTheme();
    
    
    const backgroundColor = colorScheme === 'dark' 
        ? darkColor || theme.uiBackground 
        : lightColor || theme.uiBackground;

  return (
    <View 
      style={[{ backgroundColor }, style]}
      className="rounded-lg p-4 shadow"
      {...props} 
    />
  )
}

export default ThemedCard