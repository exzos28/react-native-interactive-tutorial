import { type RefObject, useCallback, useState } from 'react';
import { type LayoutChangeEvent, View } from 'react-native';

export type LayoutResult = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MeasureResult = LayoutResult & {
  pageX: number;
  pageY: number;
};

export type NonMeasureResult = LayoutResult & { measure: false };
export type WithMeasureResult = MeasureResult & { measure: true };

export type LayoutMeasureResult =
  | undefined
  | NonMeasureResult
  | WithMeasureResult;

export default function useMeasure(ref: RefObject<View>, measure = true) {
  const [result, setResult] = useState<LayoutMeasureResult | null>(null);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const layout = {
        measure: false,
        ...event.nativeEvent.layout,
      } satisfies NonMeasureResult;
      setResult(layout);

      if (measure && ref.current) {
        ref.current.measure(
          (
            x: number,
            y: number,
            width: number,
            height: number,
            pageX: number,
            pageY: number
          ) => {
            setResult({ measure: true, x, y, width, height, pageX, pageY });
          }
        );
      }
    },
    [measure, ref]
  );

  const getResult = useCallback(() => result, [result]);

  return [getResult, onLayout] as const;
}
