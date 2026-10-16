import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import SketchArrow from './sub/SketchArrow';
import GameCard from './GameCard';
import {Game} from '../api/games';
import {Bet, Prediction} from '../api/bets';

type Props = {
  gameday: number | null;
  gamedayCount: number | null;
  // null while the games of this gameday are still loading.
  games: Game[] | null;
  myBetsByGame: Record<number, Bet>;
  onPick: (game: Game, prediction: Prediction) => Promise<void>;
  onChange: (gameday: number) => void;
};

// One Gameday: a switcher row to step between gamedays, then all games to that gameday as card components.
const Gameday = ({gameday, gamedayCount, games, myBetsByGame, onPick, onChange}: Props) => {
  const canGoBack = gameday !== null && gameday > 1;
  const canGoForward = gameday !== null && gamedayCount !== null && gameday < gamedayCount;

  return (
    <View style={styles.gameday}>
      <View style={styles.switcher}>
        <Pressable style={[styles.arrow, !canGoBack && styles.disabled]} disabled={!canGoBack} onPress={() => onChange(gameday! - 1)}>
          <SketchArrow direction="left" />
        </Pressable>
        <Text style={styles.title}>{gameday ? `${gameday}. Spieltag` : 'Lädt…'}</Text>
        <Pressable style={[styles.arrow, !canGoForward && styles.disabled]} disabled={!canGoForward} onPress={() => onChange(gameday! + 1)}>
          <SketchArrow direction="right" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.games}>
        {games === null
          ? <Text style={styles.loading}>Lädt…</Text>
          : games.map((game, index) => <GameCard key={game.id} game={game} index={index} bet={myBetsByGame[game.id]} onPick={onPick} />)}
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
  disabled: {
    opacity: 0.25,
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
  loading: {
    marginTop: 20,
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: '#5a5850',
  },
});

export default Gameday;
