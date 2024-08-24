import React from 'react';
import { StyleSheet } from 'react-native';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import BackgroundMask from './BackgroundMask';
import type { DescriptionCardProps } from './SharedDescriptionCard';
import type { Layout, Translations } from './types';

export type InteractiveTutorialViewProps = {
  targetLayout: Layout | null;
  onPrevPress(): void;
  onNextPress(): void;
  onFinishPress(): void;
  prevDisabled: boolean;
  nextExists: boolean;
  description: string;
  translations: Translations;
  Card: React.ComponentType<DescriptionCardProps>;
};

export default function InteractiveTutorialView({
  targetLayout,
  onPrevPress,
  onNextPress,
  onFinishPress,
  prevDisabled,
  nextExists,
  description,
  translations,
  Card,
}: InteractiveTutorialViewProps) {
  return (
    <Animated.View style={styles.root} entering={FadeIn} exiting={FadeOut}>
      <BackgroundMask layout={targetLayout} />
      <TouchableWithoutFeedback
        containerStyle={StyleSheet.absoluteFillObject}
        onPress={onFinishPress}
      />
      <Card
        layout={targetLayout}
        onNextPress={onNextPress}
        onFinishPress={onFinishPress}
        onPrevPress={onPrevPress}
        nextExists={nextExists}
        prevDisabled={prevDisabled}
        description={description}
        prevButton={translations.prevButton}
        nextButton={translations.nextButton}
        finishButton={translations.finishButton}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
  },
});
