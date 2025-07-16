import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleProp, View, ViewStyle, useColorScheme, type ViewProps } from 'react-native';

type ThemedViewProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
  
}

const ThemedView = ({style, ...props}: ThemedViewProps) => {

    const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
    const theme = Colors[colorScheme] ;
  return (
    <View style ={[{backgroundColor: theme.background}, style]}
    {...props}
    />
    
    
  )
}

export default ThemedView