import { Colors } from '@/constants/Colors';
import { StyleProp, Text, TextStyle, useColorScheme, type TextProps, ViewStyle } from 'react-native';



type ThemedtextProps = TextProps & {
    style?: StyleProp<TextStyle>;
    title?: boolean;
   
}
const ThemedText = ({style,title = false, ...props}: ThemedtextProps) => {
    const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light' ;
    const theme = Colors[colorScheme];
    const textColor = title ? theme.title : theme.text;
  return (
    
      <Text style={[{color: textColor},style]} {...props} />
    
  )
}

export default ThemedText