import {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {router} from 'expo-router';
import PaperLines from '../components/PaperLines';
import {getMyName} from '../api/account';
import {getMyLeagues, League} from '../api/leagues';
import {NotLoggedInError} from '../api/client';

const HomeScreen = () => {
  const [myName, setMyName] = useState('');
  const [leagues, setLeagues] = useState<League[]>([]);
  const [error, setError] = useState('');

  // Runs once when Home opens: load my name and my leagues from the server.
  useEffect(() => {
    const load = async () => {
      try {
        const name = await getMyName();
        setMyName(name);
        setLeagues(await getMyLeagues(name));
      } catch (e) {
        if (e instanceof NotLoggedInError) {
          router.replace('/');
          return;
        }
        setError('Deine Ligen konnten nicht geladen werden.');
      }
    };
    load();
  }, []);

  return (
    <View style={styles.paper}>
      <PaperLines />
      <Text style={styles.title}>{myName ? `Hallo, ${myName}!` : 'Hallo!'}</Text>
      <Text style={styles.heading}>Meine Ligen ({leagues.length})</Text>
      {leagues.map(league => (
        <Text key={league.id} style={styles.text}>{league.name}</Text>
      ))}
      {error !== '' && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  paper: {
    flex: 1,
    backgroundColor: '#fffad9',
    paddingTop: 72,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 44,
    color: '#26262b',
  },
  heading: {
    marginTop: 24,
    fontFamily: 'Caveat_700Bold',
    fontSize: 32,
    color: '#26262b',
  },
  text: {
    marginTop: 8,
    fontFamily: 'Nunito_400Regular',
    fontSize: 17,
    color: '#26262b',
  },
  error: {
    marginTop: 14,
    fontFamily: 'Caveat_700Bold',
    fontSize: 22,
    color: '#b8322a',
  },
});

export default HomeScreen;
