import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { ScrollView, type ScrollViewProps, StyleProp, ViewStyle } from 'react-native';

type ThemedScrollProps = ScrollViewProps & {
  contentContainerStyle?: StyleProp<ViewStyle>;
};

const ThemedScroll = ({contentContainerStyle, ...props}:ThemedScrollProps) => {
  const {theme} = useTheme();
  return (
    <ScrollView
    contentContainerStyle={[
      {backgroundColor:theme.background}, contentContainerStyle
    ]}
    showsVerticalScrollIndicator={false}
    {...props}
    />

   
  )
}

export default ThemedScroll