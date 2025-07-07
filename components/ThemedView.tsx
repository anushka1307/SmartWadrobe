import { View, ViewProps } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

type Props = ViewProps & {
  children: React.ReactNode;
};

export function ThemedView({ style, children, ...rest }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';

  return (
    <View style={[{ backgroundColor }, style]} {...rest}>
      {children}
    </View>
  );
}
