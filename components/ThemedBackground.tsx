
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, ImageSourcePropType, ImageStyle, StyleProp, View } from 'react-native';

type ThemedBackgroundProps = {
    style?: StyleProp<ImageStyle>;
    lightSource: ImageSourcePropType;
    darkSource: ImageSourcePropType;
}

const ThemedBackground = ({ style, lightSource, darkSource, ...props }: ThemedBackgroundProps) => {
  
    const {theme,colorScheme} = useTheme();
    const source = colorScheme === 'dark' ? darkSource : lightSource;
    let themeCheck;
    if (colorScheme !== 'dark' ){
       themeCheck = false;
    }
    else { themeCheck = true;}
    

  return (
    <View style={{position:'absolute', width:'100%', height:themeCheck ? '65%':'35%'}}>
      <ImageBackground 
        source={source}
        resizeMode={'cover'}
        style={[{
          position:'absolute', 
          width:'100%', 
          height: '100%', 
          opacity: themeCheck ? 0.3 : 0.85
        }, style]} 
        {...props}
      />
      {!themeCheck && <View className='flex-1 absolute inset-0 bg-black/50'>
        </View>}
      {themeCheck && <LinearGradient
        colors={['transparent', theme.background]}
        style={{position:'absolute', left:0, right: 0, bottom:0, height:'50%'}}
      />}
    </View>
  )
}

export default ThemedBackground