import { StyleSheet, View, Text } from 'react-native';
import InteractiveTutorial, { TARGETS } from './InteractiveTutorial';
import {
  addBorderRadius,
  addSize,
  useUiElement,
} from 'react-native-interactive-tutorial';
import useTutorialRunner from './useTutorialRunner';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Root() {
  return (
    <SafeAreaProvider>
      <InteractiveTutorial>
        <App />
      </InteractiveTutorial>
    </SafeAreaProvider>
  );
}

function App() {
  useTutorialRunner();

  const target1 = useUiElement(TARGETS.Target1, (_) => addBorderRadius(_, 10));
  const target2 = useUiElement(TARGETS.Target2, (_) =>
    addSize(addBorderRadius(_, 10), 30)
  );
  const target3 = useUiElement(TARGETS.Target3, (_) => addBorderRadius(_, 10));

  return (
    <View style={[styles.root, styles.column]}>
      <View style={styles.column}>
        <View style={styles.row}>
          <View
            style={[styles.column, styles.card]}
            ref={target1.ref}
            onLayout={target1.onLayout}
          >
            <Text>Target 1</Text>
          </View>
          <View
            style={[styles.column, styles.card]}
            ref={target2.ref}
            onLayout={target2.onLayout}
          >
            <Text>Target 3</Text>
          </View>
        </View>
        <View
          ref={target3.ref}
          onLayout={target3.onLayout}
          style={[styles.column, styles.card, { flex: 2 }]}
        >
          <Text>Target 2</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 50,
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  card: {
    borderWidth: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
