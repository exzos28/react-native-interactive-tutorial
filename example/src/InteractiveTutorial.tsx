import { type PropsWithChildren, useCallback, useMemo } from 'react';

import {
  type DescriptionCardProps,
  type SharedDescriptionCardButtonProps,
  InteractiveTutorialContainer,
  SharedDescriptionCard,
} from 'react-native-interactive-tutorial';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native';

export enum TARGETS {
  Target1,
  Target2,
  Target3,
}

export default function InteractiveTutorial({ children }: PropsWithChildren) {
  const storage = useMemo(
    () => ({
      set: (_: boolean) => AsyncStorage.setItem('tutorial', String(_)),
      get: () => AsyncStorage.getItem('tutorial').then((_) => !!_),
    }),
    []
  );

  const stack = useMemo(
    () =>
      new Map([
        [TARGETS.Target1, 'Target 1'],
        [TARGETS.Target2, 'Target 2'],
        [TARGETS.Target3, 'Target 3'],
      ]),
    []
  );

  const translations = useMemo(
    () => ({
      prevButton: 'Prev',
      nextButton: 'Next',
      finishButton: 'Finish',
    }),
    []
  );

  return (
    <InteractiveTutorialContainer
      translations={translations}
      stack={stack}
      initialTarget={TARGETS.Target1}
      Card={DescriptionCard}
      storage={storage}
    >
      {children}
    </InteractiveTutorialContainer>
  );
}

const DescriptionCard = (props: DescriptionCardProps) => {
  const DescriptionButton = useCallback(
    ({ type, ...rest }: SharedDescriptionCardButtonProps) => (
      <Button {...rest} color={type === 'prev' ? 'darkblue' : 'blue'} />
    ),
    []
  );
  return <SharedDescriptionCard Button={DescriptionButton} {...props} />;
};
