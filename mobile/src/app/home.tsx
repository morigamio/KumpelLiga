import {useCallback, useEffect, useState} from 'react';
import {Alert, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {router} from 'expo-router';
import PaperLines from '../components/PaperLines';
import LeagueCard from '../components/LeagueCard';
import LeagueSheet, {SheetMode} from '../components/LeagueSheet';
import LogoutButton from '../components/LogoutButton';
import SketchButton from '../components/SketchButton';
import {getMyName} from '../api/account';
import {getMyLeagues, League} from '../api/leagues';
import {deleteToken, NotLoggedInError} from '../api/client';

const HomeScreen = () => {
  const [myName, setMyName] = useState('');
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [sheet, setSheet] = useState<SheetMode | null>(null);

  // Loads my name and my leagues from the server.
  const load = useCallback(async () => {
    try {
      const name = await getMyName();
      setMyName(name);
      setLeagues(await getMyLeagues(name));
      setError('');
    } catch (e) {
      if (e instanceof NotLoggedInError) {
        // Forget the invalid token first, otherwise the login screen would auto-login straight back here.
        await deleteToken();
        router.replace('/');
        return;
      }
      setError('Deine Ligen konnten nicht geladen werden.');
    } finally {
      setLoaded(true);
    }
  }, []);

  // Runs once when Home opens.
  useEffect(() => {
    load();
  }, [load]);

  // Pull-to-refresh: drag the list down to reload.
  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const sheetDone = () => {
    setSheet(null);
    load();
  };

  // Logging out is client-side only: forget the token and go back to login.
  const logout = () => {
    Alert.alert(myName, 'Möchtest du dich abmelden?', [
      {text: 'Abbrechen', style: 'cancel'},
      {
        text: 'Abmelden',
        style: 'destructive',
        onPress: async () => {
          await deleteToken();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.paper}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={['#2f6f4f']} />}>
        <PaperLines />

        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{myName ? `Hallo, ${myName}!` : 'Hallo!'}</Text>
          <LogoutButton onPress={logout} />
        </View>

        <Text style={styles.heading}>
          Meine Ligen <Text style={styles.count}>({leagues.length})</Text>
        </Text>

        {leagues.map((league, index) => (
          <LeagueCard
            key={league.id}
            league={league}
            myName={myName}
            index={index}
            onPress={() => router.push({pathname: '/league', params: {id: league.id}})}
          />
        ))}

        {loaded && leagues.length === 0 && error === '' && (
          <Text style={styles.empty}>Du bist noch in keiner Liga. Tritt einer bei oder gründe eine!</Text>
        )}
        {error !== '' && <Text style={styles.error}>{error}</Text>}

        <View style={styles.spacer} />

        <SketchButton title="Liga beitreten" onPress={() => setSheet('join')} />
        <SketchButton title="Liga gründen" variant="secondary" onPress={() => setSheet('create')} />
      </ScrollView>

      {sheet && <LeagueSheet mode={sheet} onClose={() => setSheet(null)} onDone={sheetDone} />}
    </View>
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
    paddingHorizontal: 24,
  },
  header: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
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
  count: {
    fontSize: 26,
    color: '#2b4fb3',
  },
  empty: {
    marginTop: 14,
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: '#5a5850',
  },
  error: {
    marginTop: 14,
    fontFamily: 'Caveat_700Bold',
    fontSize: 22,
    color: '#b8322a',
  },
  spacer: {
    flex: 1,
    minHeight: 24,
  },
});

export default HomeScreen;
