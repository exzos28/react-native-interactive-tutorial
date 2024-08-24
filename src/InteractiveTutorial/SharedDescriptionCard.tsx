import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import type {
  LayoutChangeEvent,
  StyleProp,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

import { clamp } from 'lodash';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  type EdgeInsets,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { DISTANCE_FROM_TARGET, INSETS, TRANSITION_DURATION } from './constants';
import type { Layout } from './types';
import useMeasure from './useMeasure';

export type SharedDescriptionCardProps = {
  Button: React.ComponentType<SharedDescriptionCardButtonProps>;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export type SharedDescriptionCardButtonProps = TouchableOpacityProps & {
  title: string;
  type: 'prev' | 'next';
};

export type DescriptionCardProps = {
  layout: Layout | null;
  onPrevPress(): void;
  onNextPress(): void;
  onFinishPress(): void;
  prevDisabled: boolean;
  nextExists: boolean;
  prevButton: string;
  nextButton: string;
  finishButton: string;
  description: string;
};

export default function SharedDescriptionCard({
  layout,
  ...rest
}: SharedDescriptionCardProps & DescriptionCardProps) {
  return <$DescriptionCard layout={guard(layout)} {...rest} />;
}

const guard = (_: Layout | null): SafeLayout =>
  _ ? { type: 'accurate', layout: _ } : { type: 'zero' };

type SafeDescriptionCardProps = Omit<
  SharedDescriptionCardProps & DescriptionCardProps,
  'layout'
> & {
  layout: SafeLayout;
};

type SafeLayout =
  | {
      type: 'zero';
    }
  | {
      type: 'accurate';
      layout: Layout;
    };

type Position = { x: number; y: number };

function $DescriptionCard({
  layout,
  onPrevPress,
  onNextPress,
  onFinishPress,
  prevDisabled,
  nextExists,
  description,
  prevButton,
  nextButton,
  finishButton,
  Button,
  style,
  textStyle,
}: SafeDescriptionCardProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const insets_ = useSafeAreaInsets();
  const insets = mergeInsets(INSETS, insets_);

  const ref = useRef(null);
  const [getResult, onLayout] = useMeasure(ref, true);
  const animationStarted = useRef(false);

  const pristine = useRef(true);
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);

  const animate = useCallback(
    (position: Position) => {
      const duration = pristine.current ? 0 : TRANSITION_DURATION;

      animationStarted.current = true;
      // Animate to the new position
      positionX.value = withTiming(position.x, { duration }, (finished) => {
        if (finished) {
          animationStarted.current = false;
        }
      });
      positionY.value = withTiming(position.y, { duration }, (finished) => {
        if (finished) {
          animationStarted.current = false;
        }
      });
      pristine.current = false;
    },
    [positionX, positionY]
  );

  const calculate = useCallback(
    (safeLayout: SafeLayout) => {
      const card = getResult();
      if (!card) {
        return;
      }
      const { width, height } = card;

      if (safeLayout.type === 'zero') {
        return animate({
          x: screenWidth / 2 - width / 2,
          y: insets.top,
        });
      }

      const _ = safeLayout.layout;

      const positions = {
        top: {
          x: clamp(
            _.pageX + _.width / 2 - width / 2,
            0,
            screenWidth - width - insets.right
          ),
          y: clamp(
            _.pageY - height - DISTANCE_FROM_TARGET,
            insets.top,
            screenHeight - insets.bottom
          ),
        },
        bottom: {
          x: clamp(
            _.pageX + _.width / 2 - width / 2,
            0,
            screenWidth - width - insets.right
          ),
          y: clamp(
            _.pageY + _.height + DISTANCE_FROM_TARGET,
            insets.bottom,
            screenHeight - insets.bottom
          ),
        },
      };

      let chosenPosition = positions.bottom;

      if (
        positions.top.y > insets.top &&
        positions.top.y + height < screenHeight - insets.bottom
      ) {
        chosenPosition = positions.top;
      }

      return animate(chosenPosition);
    },
    [animate, getResult, insets, screenHeight, screenWidth]
  );

  useEffect(() => {
    calculate(layout);
  }, [calculate, layout]);

  const handleLayout = useCallback(
    (_: LayoutChangeEvent) => {
      if (!animationStarted.current) {
        onLayout(_);
        calculate(layout);
      }
    },
    [calculate, layout, onLayout]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    top: positionY.value,
    left: positionX.value,
  }));

  const width = Math.min(Math.max(250, screenWidth * 0.7), 400);
  console.log('width', width);

  return (
    <Animated.View
      onLayout={handleLayout}
      ref={ref}
      style={[
        animatedStyle,
        styles.root,
        style,
        {
          width,
        },
      ]}
    >
      <Text style={[styles.text, textStyle]}>{description}</Text>

      <View style={styles.buttons}>
        <Button
          style={styles.button}
          title={prevButton}
          onPress={onPrevPress}
          disabled={prevDisabled}
          type={'prev'}
        />
        <Button
          style={styles.button}
          title={nextExists ? nextButton : finishButton}
          onPress={nextExists ? onNextPress : onFinishPress}
          type={'next'}
        />
      </View>
    </Animated.View>
  );
}

const mergeInsets = (...insets: EdgeInsets[]) => ({
  top: Math.max(...insets.map((_) => _.top)),
  right: Math.max(...insets.map((_) => _.right)),
  bottom: Math.max(...insets.map((_) => _.bottom)),
  left: Math.max(...insets.map((_) => _.left)),
});

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    width: '100%',
  },
  text: {
    fontSize: 14,
    lineHeight: 14 * 1.3,
  },
  buttons: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    minWidth: 100,
  },
});
