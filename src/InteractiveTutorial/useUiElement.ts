import { useCallback, useRef } from 'react';
import { type LayoutChangeEvent, View } from 'react-native';

import type { Layout, Name } from './types';
import useInteractiveTutorial from './useInteractiveTutorial';

const defaultProxy = <L extends Layout>(_: L): L => _;

export const addWidth = <L extends Layout>(_: L, v: number): L => ({
  ..._,
  pageX: _.pageX - v / 2,
  width: _.width + v,
});

export const addHeight = <L extends Layout>(_: L, v: number): L => ({
  ..._,
  pageY: _.pageY - v / 2,
  height: _.height + v,
});

export const addSize = <L extends Layout>(_: L, v: number): L =>
  addHeight(addWidth(_, v), v);

export const addBorderRadius = <L extends Layout>(_: L, v: number): L => ({
  ..._,
  borderRadius: v,
});

export default function useUiElement(target: Name, layoutProxy = defaultProxy) {
  const tutorial = useInteractiveTutorial();
  const ref = useRef<View>(null);
  const onLayout = useCallback(
    (_: LayoutChangeEvent) => {
      const measure = () =>
        new Promise<Layout>((resolve) =>
          ref.current?.measure(
            (
              x: number,
              y: number,
              width: number,
              height: number,
              pageX: number,
              pageY: number
            ) => {
              const result = { x, y, width, height, pageX, pageY };
              resolve(layoutProxy(result));
            }
          )
        );
      tutorial.register(measure, target);
    },
    [layoutProxy, target, tutorial]
  );
  return { ref, onLayout };
}
