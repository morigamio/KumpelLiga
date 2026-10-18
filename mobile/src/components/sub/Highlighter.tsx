import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Svg, {Path} from 'react-native-svg';

type Props = {
  color: string;
  // Where the patch sits inside its parent; by default it fills it completely.
  style?: StyleProp<ViewStyle>;
};

// One highlighter swipe: wavy top and bottom edges, frayed ends where the marker was put down and lifted.
// Drawn in a 100 × 40 box and stretched to any size, so no measuring is needed.
const SWIPE =
  'M 6 9 C 30 5, 65 8, 95 4 L 97 12 L 94 20 L 98 29 C 70 34, 35 32, 4 36 L 2 27 L 6 19 L 3 11 Z';

// A free-form highlighter patch that sits behind a text, like a real marker swipe.
const Highlighter = ({color, style}: Props) => (
  <View style={[StyleSheet.absoluteFill, style]}>
    <Svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
      <Path d={SWIPE} fill={color} />
    </Svg>
  </View>
);

export default Highlighter;
