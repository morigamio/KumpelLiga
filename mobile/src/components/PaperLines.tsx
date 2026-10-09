import {StyleSheet, View} from 'react-native';

const LINE_SPACING = 36;
const LINE_COUNT = 40;

// The ruled lines of the notebook paper. Place it as the first child of a screen's container.
const PaperLines = () => {
  return Array.from({length: LINE_COUNT}, (_, i) => (
    <View key={i} style={[styles.line, {top: (i + 1) * LINE_SPACING - 1}]} />
  ));
};

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#e4e2da',
  },
});

export default PaperLines;
