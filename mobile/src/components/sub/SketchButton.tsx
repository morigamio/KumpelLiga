import {Pressable, StyleSheet, Text} from 'react-native';
import HandText from './HandText';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

// Big hand-drawn button: primary = green filled, secondary = paper with ink border.
const SketchButton = ({title, onPress, variant = 'primary', disabled = false}: Props) => {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      style={[styles.button, isPrimary ? styles.primary : styles.secondary, disabled && styles.disabled]}
      disabled={disabled}
      onPress={onPress}>
      <HandText style={[styles.text, isPrimary && styles.primaryText]}>{title}</HandText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 58,
    marginTop: 14,
    borderWidth: 2.5,
    borderColor: '#26262b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  primary: {
    backgroundColor: '#2f6f4f',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 26,
    borderBottomLeftRadius: 10,
  },
  secondary: {
    backgroundColor: '#fffdf8',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 30,
  },
  text: {
    fontSize: 30,
    color: '#26262b',
  },
  primaryText: {
    color: '#fffaf0',
  },
});

export default SketchButton;
