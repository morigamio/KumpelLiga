import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {useFonts} from 'expo-font';
import {Caveat_500Medium, Caveat_700Bold} from '@expo-google-fonts/caveat';
import {Nunito_400Regular, Nunito_700Bold} from '@expo-google-fonts/nunito';
import BuddiesDoodle from './components/BuddiesDoodle';

const LINE_SPACING = 36;
const LINE_COUNT = 40;

const App = () => {
  const [fontsLoaded] = useFonts({
    Caveat_500Medium,
    Caveat_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.paper}>
      {Array.from({length: LINE_COUNT}, (_, i) => (
        <View key={i} style={[styles.line, {top: (i + 1) * LINE_SPACING - 1}]} />
      ))}

      <BuddiesDoodle/>

      <Text style={styles.title}>
        Kumpel<Text style={styles.titleAccent}>Liga</Text>
      </Text>
      <Text style={styles.slogan}>Für Kumpels und Kumpelinen.</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Benutzername</Text>
        <TextInput style={styles.input} placeholder="dein Name" autoCapitalize="none" />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Passwort</Text>
        <TextInput style={styles.input} placeholder="••••••••" secureTextEntry />
      </View>

      <View style={styles.spacer} />

      <Pressable style={[styles.button, styles.primaryButton]}>
        <Text style={[styles.buttonText, styles.primaryButtonText]}>Anmelden</Text>
      </Pressable>
      <Pressable style={[styles.button, styles.secondaryButton]}>
        <Text style={styles.buttonText}>Registrieren</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  paper: {
    flex: 1,
    backgroundColor: '#fffad9',
    paddingTop: 72,
    paddingBottom: 40,
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
    fontFamily: 'Caveat_700Bold',
    fontSize: 58,
    color: '#26262b',
    textAlign: 'center',
  },
  titleAccent: {
    color: '#2f6f4f',
  },
  slogan: {
    fontFamily: 'Caveat_500Medium',
    fontSize: 24,
    color: '#4a4943',
    textAlign: 'center',
    marginTop: 10,
  },
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
  spacer: {
    flex: 1,
  },
  button: {
    height: 58,
    marginTop: 14,
    borderWidth: 2.5,
    borderColor: '#26262b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#2f6f4f',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 26,
    borderBottomLeftRadius: 10,
  },
  secondaryButton: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 30,
    backgroundColor: '#fffdf8',
  },
  buttonText: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 30,
    color: '#26262b',
  },
  primaryButtonText: {
    color: '#fffaf0',
  },
});

export default App;
