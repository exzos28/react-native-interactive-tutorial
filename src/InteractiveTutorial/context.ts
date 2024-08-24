import { createContext } from 'react';

import type { Name, Target, UiElement } from './types';

export type InteractiveTutorialContextType = {
  readonly target: Target | null;
  readonly prevExists: boolean;
  readonly nextExists: boolean;
  register: (measure: UiElement['measure'], name: Name) => void;
  goToPrevStep(): void;
  goToNextStep(): void;
  show(): void;
  hide(): void;
  finish(): void;
  readonly visible: boolean;
  readonly finished: boolean | undefined;
  readonly description: string | undefined;
};

export const InteractiveTutorialContext = createContext<
  InteractiveTutorialContextType | undefined
>(undefined);
