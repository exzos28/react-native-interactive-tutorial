import { useContext } from 'react';

import { InteractiveTutorialContext } from './context';

export default function useInteractiveTutorial() {
  const context = useContext(InteractiveTutorialContext);
  if (!context) {
    throw new Error(
      'useInteractiveTutorial must be used within a InteractiveTutorialProvider'
    );
  }
  return context;
}
