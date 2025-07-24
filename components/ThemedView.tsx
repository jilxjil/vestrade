import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleProp, View, ViewStyle, type ViewProps } from 'react-native';

type ThemedViewProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
  
}

const ThemedView = ({style, ...props}: ThemedViewProps) => {

    
    const {theme} = useTheme();
  return (
    <View style ={[{backgroundColor: theme.background}, style]}
    {...props}
    />
    
    
  )
}

export default ThemedView