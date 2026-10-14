import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import GameCard from './GameCard';
import SketchArrow from './sub/SketchArrow';

// Placeholder until real games are passed in.
const GAMES = [1, 2, 3];

// One Gameday: a switcher row to step between gamedays, then all games to that gameday as card components.
const Gameday = () => {
  return (
    <View style={styles.gameday}>
      <View style={styles.switcher}>
        <Pressable style={styles.arrow}>
          <SketchArrow direction="left" />
        </Pressable>
        <Text style={styles.title}>1. Spieltag</Text>
        <Pressable style={styles.arrow}>
          <SketchArrow direction="right" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.games}>
        {GAMES.map(game => <GameCard key={game} />)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  gameday: {
    flex: 1,
    marginTop: 16,
  },
  switcher: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrow: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Caveat_700Bold',
    fontSize: 26,
    color: '#26262b',
  },
  games: {
    paddingBottom: 24,
  },
});

export default Gameday;
