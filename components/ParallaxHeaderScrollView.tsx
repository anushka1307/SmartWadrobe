import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView'; // dark/light mode wrapper
import { useBottomTabOverflow } from '@/components/TabBarBackground'; // adjust for bottom tab
import { useColorScheme } from '@/hooks/useColorScheme'; // returns 'light' or 'dark'

const HEADER_HEIGHT = 250;

type ParallaxHeaderScrollViewProps = PropsWithChildren<{
  headerImage: ReactElement; // JSX to show inside header (e.g., Image, promo banner)
  headerBackgroundColor: { light: string; dark: string }; // color for header bg based on theme
}>;

export default function ParallaxHeaderScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: ParallaxHeaderScrollViewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottomInset = useBottomTabOverflow();

  // Animations for header image (translate + scale effect)
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom: bottomInset }}
        contentContainerStyle={{ paddingBottom: bottomInset }}
      >
        {/* Parallax Header */}
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}
        >
          {headerImage}
        </Animated.View>

        {/* Scrollable Content */}
        <ThemedView style={styles.content}>
          {children}
        </ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
});
