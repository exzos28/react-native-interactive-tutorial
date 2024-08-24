import React, { type PropsWithChildren, useCallback } from 'react';

import InteractiveTutorialProvider, {
  type InteractiveTutorialProviderProps,
} from './InteractiveTutorialProvider';
import InteractiveTutorialView from './InteractiveTutorialView';
import type { DescriptionCardProps } from './SharedDescriptionCard';
import type { Translations } from './types';
import useInteractiveTutorial from './useInteractiveTutorial';

export type InteractiveTutorialContainerProps =
  InteractiveTutorialProviderProps & {
    translations: Translations;
    Card: React.ComponentType<DescriptionCardProps>;
  };

export default function InteractiveTutorialContainer({
  children,
  translations,
  Card,
  ...rest
}: PropsWithChildren<InteractiveTutorialContainerProps>) {
  return (
    <InteractiveTutorialProvider {...rest}>
      {children}
      <$InteractiveTutorial translations={translations} Card={Card} />
    </InteractiveTutorialProvider>
  );
}

type $InteractiveTutorialProps = {
  translations: Translations;
  Card: React.ComponentType<DescriptionCardProps>;
};
function $InteractiveTutorial({
  translations,
  Card,
}: $InteractiveTutorialProps) {
  const {
    target,
    goToNextStep,
    nextExists,
    goToPrevStep,
    description,
    prevExists,
    visible,
    finish,
  } = useInteractiveTutorial();

  const next = useCallback(() => goToNextStep(), [goToNextStep]);
  const prev = useCallback(() => goToPrevStep(), [goToPrevStep]);
  const prevDisabled = !prevExists;

  if (!visible) {
    return null;
  }

  const targetLayout = target?.element.layout || null;

  return (
    <InteractiveTutorialView
      targetLayout={targetLayout}
      onNextPress={next}
      onFinishPress={finish}
      onPrevPress={prev}
      nextExists={nextExists}
      prevDisabled={prevDisabled}
      description={description ?? ''}
      translations={translations}
      Card={Card}
    />
  );
}
