import { useTheme } from '@/contexts/ThemeContext';
import { StyleProp, Text, TextStyle, type TextProps } from 'react-native';

type ThemedtextProps = TextProps & {
  style?: StyleProp<TextStyle>;
  title?: boolean;
}

const ThemedText = ({style, title = false, ...props}: ThemedtextProps) => {
  const { theme } = useTheme();
  
  const textColor = title ? theme.title : theme.text;
  
  return (
    <Text style={[{color: textColor}, style]} {...props} />
  );
}

export default ThemedText;