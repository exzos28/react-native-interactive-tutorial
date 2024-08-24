import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { isEqual } from 'lodash';

import { InteractiveTutorialContext } from './context';
import type { Name, Target, UiElement } from './types';

export type Stack = Map<Name, string>;

export type InteractiveTutorialProviderProps = {
  storage: {
    set(_: boolean): Promise<void>;
    get(): Promise<boolean | undefined>;
  };
  stack: Stack;
  initialTarget: Name;
};

export default function InteractiveTutorialProvider({
  children,
  storage,
  stack,
  initialTarget,
}: PropsWithChildren<InteractiveTutorialProviderProps>) {
  const [targets, setTargets] = useState<Map<Name, Target>>(new Map());
  const [steps] = useState<Name[]>(() => [...stack.keys()]);
  const [currentTarget, setCurrentTarget] = useState<Name>(() => initialTarget);
  const [visible, setVisible] = useState(false);
  const [finished, setFinished] = useState<boolean>();

  useEffect(() => {
    storage.get().then((_) => setFinished(_ ?? false));
  }, [storage]);

  const description = stack.get(currentTarget);

  const target = useMemo(
    () => targets.get(currentTarget) ?? null,
    [currentTarget, targets]
  );

  const prevExists = steps.indexOf(currentTarget) > 0;
  const nextExists = steps.indexOf(currentTarget) < steps.length - 1;

  const updateLayout = useCallback(async (_: Map<Name, Target>, name: Name) => {
    const newTargets = new Map(_);
    const candidate = newTargets.get(name);

    if (!candidate) {
      return;
    }

    const element = candidate.element;
    const newLayout = await element.measure();

    if (!isEqual(element.layout, newLayout)) {
      element.layout = await element.measure();

      setTargets(newTargets);
    }
  }, []);

  const register = useCallback(
    (measure: UiElement['measure'], name: Name) => {
      setTargets((prevTargets) => {
        if (prevTargets.has(name)) {
          updateLayout(prevTargets, name);
          return prevTargets;
        }

        const newTargets = new Map(prevTargets);
        const element = {
          measure,
          layout: null,
        };
        newTargets.set(name, { element, name });

        updateLayout(newTargets, name);
        return newTargets;
      });
    },
    [updateLayout]
  );

  const goToPrevStep = useCallback(() => {
    const prevIndex = steps.indexOf(currentTarget) - 1;
    const next = prevIndex >= 0 ? steps[prevIndex]! : initialTarget;
    // noinspection JSIgnoredPromiseFromCall
    updateLayout(targets, next);
    setCurrentTarget(next);
  }, [currentTarget, initialTarget, steps, targets, updateLayout]);

  const goToNextStep = useCallback(() => {
    const nextIndex = steps.indexOf(currentTarget) + 1;
    const next = nextIndex < steps.length ? steps[nextIndex]! : initialTarget;
    // noinspection JSIgnoredPromiseFromCall
    updateLayout(targets, next);
    setCurrentTarget(next);
  }, [currentTarget, initialTarget, steps, targets, updateLayout]);

  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);

  const finish = useCallback(async () => {
    setFinished(true);
    setVisible(false);
    await storage.set(true);
  }, [storage]);

  return (
    <InteractiveTutorialContext.Provider
      value={{
        target,
        prevExists,
        nextExists,
        register,
        goToPrevStep,
        goToNextStep,
        show,
        hide,
        finish,
        visible,
        finished,
        description,
      }}
    >
      {children}
    </InteractiveTutorialContext.Provider>
  );
}
