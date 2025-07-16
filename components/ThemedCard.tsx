import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle, useColorScheme } from 'react-native';

type ThemedCardProps = ViewProps & {
    style?: StyleProp<ViewStyle>;
    lightColor? : string;
    darkColor?: string;

}

const ThemedCard = ({style, ...props}:ThemedCardProps) => {
    const colorScheme= useColorScheme() === 'dark' ? 'dark' : 'light';
    const theme = Colors[colorScheme];

  return (
    <View>
      <Text>ThemedCard</Text>
    </View>
  )
}

export default ThemedCard