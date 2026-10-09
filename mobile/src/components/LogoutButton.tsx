import {Pressable, StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';

type Props = {
  onPress: () => void;
};

// Round hand-drawn button with a door and an arrow walking out of it, top right on Home.
const LogoutButton = ({onPress}: Props) => {
  return (
    <Pressable style={styles.button} onPress={onPress} accessibilityLabel="Abmelden">
      <Svg width={34} height={34} viewBox="0 0 100 100" fill="none" stroke="#26262b" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M56 14 C 44 13, 33 14, 22 15 C 19 40, 19 62, 21 86 C 33 87, 44 87, 56 86" />
        <Path d="M40 51 C 56 50, 70 50, 86 51" />
        <Path d="M72 36 C 77 41, 82 46, 87 51 C 82 56, 77 61, 72 66" />
      </Svg>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffaf0',
    borderWidth: 2.5,
    borderColor: '#26262b',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 26,
  },
});

export default LogoutButton;
