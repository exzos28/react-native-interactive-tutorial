import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import { nanoid } from 'nanoid/non-secure';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { mixPath } from 'react-native-redash';
import Svg, { Defs, Mask, Path, Rect } from 'react-native-svg';

import { TRANSITION_DURATION } from './constants';
import createRePath from './createRePath';
import type { Layout } from './types';

export type BackgroundMaskProps = {
  layout: Layout | null;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function BackgroundMask({ layout }: BackgroundMaskProps) {
  if (!layout) {
    return <EmptyMask />;
  }
  return <$BackgroundMask layout={layout} />;
}

type SafeBackgroundMaskProps = {
  layout: Layout;
};

function $BackgroundMask({ layout }: SafeBackgroundMaskProps) {
  const maskId = useRef(nanoid(10));
  const transitionValue = useSharedValue(0);

  const [state, setState] = useState(() => ({
    before: createRePath(layout),
    current: createRePath(layout),
  }));

  useEffect(() => {
    transitionValue.value = 0;
    const nextD = createRePath(layout);
    setState((prevState) => ({
      before: prevState.current,
      current: nextD,
    }));
    transitionValue.value = withTiming(1, { duration: TRANSITION_DURATION });
  }, [layout, transitionValue]);

  const animatedProps = useAnimatedProps(() => ({
    d: mixPath(transitionValue.value, state.before, state.current),
  }));

  return (
    <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
      <Defs>
        <Mask id={maskId.current} x="0" y="0">
          <Rect x="0" y="0" width="100%" height="100%" fill="#a6a6a6" />
          <AnimatedPath
            onPress={() => {}}
            animatedProps={animatedProps}
            fill="#000"
          />
        </Mask>
      </Defs>
      <Rect
        width="100%"
        height="100%"
        fill="#000000"
        mask={`url(#${maskId.current})`}
      />
    </Svg>
  );
}

function EmptyMask() {
  const maskId = useRef(nanoid(10));
  return (
    <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
      <Defs>
        <Mask id={maskId.current} x="0" y="0">
          <Rect x="0" y="0" width="100%" height="100%" fill="#a6a6a6" />
        </Mask>
      </Defs>
      <Rect
        width="100%"
        height="100%"
        fill="#000000"
        mask={`url(#${maskId.current})`}
      />
    </Svg>
  );
}
