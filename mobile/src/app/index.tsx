import {useEffect, useState} from 'react';
import {KeyboardAvoidingView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {router} from 'expo-router';
import BuddiesDoodle from '../components/BuddiesDoodle';
import PaperLines from '../components/PaperLines';
import SketchField from '../components/SketchField';
import SketchButton from '../components/SketchButton';
import {login, register} from '../api/auth';
import {getToken, saveToken} from '../api/client';

const LoginScreen = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  // Auto-login: if a token is already saved, skip the form and go straight to Home.
  // Whether the token is still valid is checked by Home (a 401 sends us back here).
  useEffect(() => {
    const check = async () => {
      if (await getToken()) {
        router.replace('/home');
      } else {
        setCheckingToken(false);
      }
    };
    check();
  }, []);

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

  // Blank paper while we look for a token, so the login form doesn't flash up before the redirect.
  if (checkingToken) {
    return <View style={styles.screen} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior="padding">
      <ScrollView contentContainerStyle={styles.paper} keyboardShouldPersistTaps="handled">
        <PaperLines />

        <BuddiesDoodle/>

        <Text style={styles.title}>
          Kumpel<Text style={styles.titleAccent}>Liga</Text>
        </Text>
        <Text style={styles.slogan}>Für Kumpels und Kumpelinen.</Text>

        <SketchField placeholder="Benutzername" value={name} onChangeText={setName} />
        <SketchField placeholder="Passwort" secure value={password} onChangeText={setPassword} />

        {error !== '' && <Text style={styles.error}>{error}</Text>}

        <View style={styles.spacer} />

        <SketchButton title={busy ? 'Moment…' : 'Anmelden'} disabled={busy} onPress={() => submit('login')} />
        <SketchButton title="Registrieren" variant="secondary" disabled={busy} onPress={() => submit('register')} />
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
});

export default LoginScreen;
