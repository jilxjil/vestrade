
import { Image, StyleProp, useColorScheme, ViewProps, ViewStyle } from 'react-native';

type ThemedLogoProps = ViewProps & {
    style?: StyleProp<ViewStyle>;
    
}
const ThemedLogo = ({style ,...props}:ThemedLogoProps) => {
    const colorScheme  = useColorScheme() === 'dark' ? 'darkImage' : 'lightImage';
    const logo = colorScheme;

  return (
    <Image src={logo}/>
  )
}

export default ThemedLogo