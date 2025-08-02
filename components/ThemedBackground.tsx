
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, ImageSourcePropType, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';

type ThemedBackgroundProps = {
    style?: StyleProp<ImageStyle>;
    lightSource: ImageSourcePropType;
    darkSource: ImageSourcePropType;
}

const ThemedBackground = ({ style, lightSource, darkSource, ...props }: ThemedBackgroundProps) => {
  const { theme, colorScheme } = useTheme();
  const source = colorScheme === 'dark' ? darkSource : lightSource;
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ width: '100%', height: '100%', position: 'absolute' }}>
      <ImageBackground
        source={source}
        resizeMode={'cover'}
        style={[{
          width: '100%',
          height: '100%',
          opacity: isDark ? 0.3 : 0.85,
        }, style]}
        {...props}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.08)']}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
};

export default ThemedBackground