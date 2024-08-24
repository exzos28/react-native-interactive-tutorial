import { useEffect } from 'react';
import { useInteractiveTutorial } from 'react-native-interactive-tutorial';

export default function useTutorialRunner() {
  const tutorial = useInteractiveTutorial();

  useEffect(() => {
    if (tutorial.finished === false) {
      setTimeout(() => tutorial.show());
    }
  }, [tutorial]);
}
