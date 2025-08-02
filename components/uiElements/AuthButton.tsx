import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { ActivityIndicator, Pressable, PressableProps } from 'react-native';
import ThemedText from '../ThemedText';

interface AuthButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  style?: any;
}

const AuthButton = ({ 
  title, 
  loading = false, 
  variant = 'primary', 
  size = 'md',
  style,
  disabled,
  ...props 
}: AuthButtonProps) => {
  const { theme, colorScheme } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = 'rounded-xl items-center justify-center';
    const sizeStyle = {
      sm: 'py-2 px-4',
      md: 'py-4 px-6',
      lg: 'py-5 px-8'
    };
    
    const variantStyle = {
      primary: {
        backgroundColor: Colors.primary,
        borderWidth: 0
      },
      secondary: {
        backgroundColor: colorScheme === 'dark' ? '#374151' : '#F3F4F6',
        borderWidth: 0
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.primary
      }
    };

    return `${baseStyle} ${sizeStyle[size]}`;
  };

  const getTextStyle = () => {
    const baseStyle = 'font-semibold';
    const sizeStyle = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };
    
    const variantTextStyle = {
      primary: { color: '#FFFFFF' },
      secondary: { color: theme.text },
      outline: { color: Colors.primary }
    };

    return `${baseStyle} ${sizeStyle[size]}`;
  };

  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={getButtonStyle()}
      style={[
        {
          opacity: isDisabled ? 0.6 : 1,
          ...(variant === 'primary' ? { backgroundColor: Colors.primary } : {}),
          ...(variant === 'secondary' ? { 
            backgroundColor: colorScheme === 'dark' ? '#374151' : '#F3F4F6' 
          } : {}),
          ...(variant === 'outline' ? { 
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: Colors.primary
          } : {}),
        },
        style as any
      ]}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#FFFFFF' : Colors.primary} 
        />
      ) : (
        <ThemedText 
          className={getTextStyle()}
          style={[
            variant === 'primary' ? { color: '#FFFFFF' } : {},
            variant === 'secondary' ? { color: theme.text } : {},
            variant === 'outline' ? { color: Colors.primary } : {},
          ]}
        >
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
};

export default AuthButton; 