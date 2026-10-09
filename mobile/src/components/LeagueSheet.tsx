import {useState} from 'react';
import {KeyboardAvoidingView, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import SketchField from './SketchField';
import SketchButton from './SketchButton';
import {createLeague, joinLeague} from '../api/leagues';

export type SheetMode = 'join' | 'create';

type Props = {
  mode: SheetMode;
  onClose: () => void;
  onDone: () => void;
};

const TEXTS = {
  join: {title: 'Liga beitreten', button: 'Beitreten'},
  create: {title: 'Liga gründen', button: 'Gründen'},
};

// Floating window at the bottom with league name + password, for joining or creating a league.
const LeagueSheet = ({mode, onClose, onDone}: Props) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!name.trim() || !password) {
      setError('Bitte Liga-Name und Passwort eingeben.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      if (mode === 'join') {
        await joinLeague(name.trim(), password);
      } else {
        await createLeague(name.trim(), password);
      }
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Da ist etwas schiefgelaufen.');
      setBusy(false);
    }
  };

  return (
    <Modal transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.backdrop} behavior="padding">
        <Pressable style={styles.outside} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{TEXTS[mode].title}</Text>
          <SketchField placeholder="Liga-Name" value={name} onChangeText={setName} />
          <SketchField placeholder="Liga-Passwort" secure value={password} onChangeText={setPassword} />
          {error !== '' && <Text style={styles.error}>{error}</Text>}
          <SketchButton title={busy ? 'Moment…' : TEXTS[mode].button} disabled={busy} onPress={submit} />
          <SketchButton title="Abbrechen" variant="secondary" disabled={busy} onPress={onClose} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(38, 38, 43, 0.35)',
  },
  outside: {
    flex: 1,
  },
  sheet: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: '#fffad9',
    borderWidth: 2.5,
    borderColor: '#26262b',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 26,
    borderBottomLeftRadius: 18,
  },
  title: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 36,
    color: '#26262b',
  },
  error: {
    marginTop: 14,
    fontFamily: 'Caveat_700Bold',
    fontSize: 22,
    color: '#b8322a',
    textAlign: 'center',
  },
});

export default LeagueSheet;
