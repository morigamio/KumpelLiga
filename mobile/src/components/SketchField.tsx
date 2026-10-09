import {StyleSheet, Text, TextInput, View} from 'react-native';

type Props = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secure?: boolean;
};

// A text input (optionally with a label above it) in a hand-drawn box, like the league cards.
const SketchField = ({label, value, onChangeText, placeholder, secure = false}: Props) => {
  return (
    <View style={styles.field}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, value === '' && styles.placeholder]}
        placeholder={placeholder}
        autoCapitalize="none"
        secureTextEntry={secure}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fffdf8',
    borderWidth: 2,
    borderColor: '#26262b',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 14,
  },
  label: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 24,
    color: '#26262b',
  },
  input: {
    height: 46,
    fontFamily: 'Nunito_400Regular',
    fontSize: 17,
    color: '#26262b',
  },
  // While the field is empty, the placeholder shows in handwriting. React Native has no separate
  // placeholder font, so we switch the whole input's font as long as nothing is typed.
  placeholder: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 22,
  },
});

export default SketchField;
