import {Pressable, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import HandText from './HandText';

type Props = {
  // My 2x of this gameday sits on this game: blue; otherwise gray.
  marked: boolean;
  // Without onPress the tag can't be tapped (e.g. after kickoff or while a request runs).
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const BLUE = '#2b4fb3';
const GRAY = '#8a877d';

const WIDTH = 48;
const HEIGHT = 31;

// The tilted "2x" tag in the top right corner of a game card.
const DoubleTag = ({marked, onPress, style}: Props) => {
  const color = marked ? BLUE : GRAY;

  return (
    <Pressable style={[styles.tag, {borderColor: color}, style]} disabled={!onPress} onPress={onPress}>
      <HandText style={[styles.label, {color}]}>2x</HandText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tag: {
    width: WIDTH,
    height: HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: HEIGHT / 2,
    transform: [{rotate: '-5deg'}],
  },
  label: {
    fontSize: 20,
  },
});

export default DoubleTag;
