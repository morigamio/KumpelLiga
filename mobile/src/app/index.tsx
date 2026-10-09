import {useState} from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useFonts} from 'expo-font';
import {router} from 'expo-router';
import {Caveat_500Medium, Caveat_700Bold} from '@expo-google-fonts/caveat';
import {Nunito_400Regular, Nunito_700Bold} from '@expo-google-fonts/nunito';
import BuddiesDoodle from '../components/BuddiesDoodle';
import {login, register, saveToken} from '../api/auth';

const LINE_SPACING = 36;
const LINE_COUNT = 40;

const LoginScreen = () => {
  const [fontsLoaded] = useFonts({
    Caveat_500Medium,
    Caveat_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
  });
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (mode: 'login' | 'register') => {
    if (!name.trim() || !password) {
      setError('Bitte Benutzername und Passwort eingeben.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      if (mode === 'register') {
        await register(name.trim(), password);
      }
      const token = await login(name.trim(), password);
      await saveToken(token);
      router.replace('/home');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Da ist etwas schiefgelaufen.');
    } finally {
      setBusy(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior="padding">
      <ScrollView contentContainerStyle={styles.paper} keyboardShouldPersistTaps="handled">
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
          <TextInput
            style={styles.input}
            placeholder="dein Name"
            autoCapitalize="none"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Passwort</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error !== '' && <Text style={styles.error}>{error}</Text>}

        <View style={styles.spacer} />

        <Pressable
          style={[styles.button, styles.primaryButton, busy && styles.buttonBusy]}
          disabled={busy}
          onPress={() => submit('login')}>
          <Text style={[styles.buttonText, styles.primaryButtonText]}>{busy ? 'Moment…' : 'Anmelden'}</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.secondaryButton, busy && styles.buttonBusy]}
          disabled={busy}
          onPress={() => submit('register')}>
          <Text style={styles.buttonText}>Registrieren</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fffad9',
  },
  paper: {
    flexGrow: 1,
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
  error: {
    marginTop: 14,
    fontFamily: 'Caveat_700Bold',
    fontSize: 22,
    color: '#b8322a',
    textAlign: 'center',
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
  buttonBusy: {
    opacity: 0.5,
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

export default LoginScreen;
