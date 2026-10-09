import {StyleSheet, Text, View} from 'react-native';

const LINE_SPACING = 36;
const LINE_COUNT = 40;

const App = () => {
  return (
    <View style={styles.paper}>
      {Array.from({length: LINE_COUNT}, (_, i) => (
        <View key={i} style={[styles.line, {top: (i + 1) * LINE_SPACING - 1}]} />
      ))}
      <Text style={styles.title}>KumpelLiga</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  paper: {
    flex: 1,
    backgroundColor: '#fffad9',
    paddingTop: 72,
    paddingHorizontal: 32,
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#e4e2da',
  },
  title: {
    fontSize: 58,
    color: '#26262b',
    textAlign: 'center',
  },
});

export default App;
