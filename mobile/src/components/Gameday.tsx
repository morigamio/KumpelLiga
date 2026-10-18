import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import SketchArrow from './sub/SketchArrow';
import GameCard from './GameCard';
import {Game} from '../api/games';
import {Bet, Prediction} from '../api/bets';
import HandText from './sub/HandText';

type Props = {
  gameday: number;
  gamedayCount: number;
  // null while the games of this gameday are still loading.
  games: Game[] | null;
  myBetsByGame: Record<number, Bet>;
  onPick: (game: Game, prediction: Prediction) => Promise<void>;
  onDouble: (game: Game) => Promise<void>;
  onChange: (gameday: number) => void;
};

// One Gameday: a switcher row to step between gamedays, then all games to that gameday as card components.
const Gameday = ({gameday, gamedayCount, games, myBetsByGame, onPick, onDouble, onChange}: Props) => {
  const canGoBack = gameday > 1;
  const canGoForward = gameday < gamedayCount;

  // My 2x is used up once the game carrying it has kicked off. Derived on every render, so it can't go stale.
  const isDoubleUsed = (games ?? []).some(game =>
    myBetsByGame[game.id]?.isDouble && new Date(game.matchTime).getTime() <= Date.now());

  return (
    <View style={styles.gameday}>
      <View style={styles.switcher}>
        <Pressable style={[styles.arrow, !canGoBack && styles.disabled]} disabled={!canGoBack} onPress={() => onChange(gameday - 1)}>
          <SketchArrow direction="left" />
        </Pressable>
        <HandText style={styles.title}>{gameday}. Spieltag</HandText>
        <Pressable style={[styles.arrow, !canGoForward && styles.disabled]} disabled={!canGoForward} onPress={() => onChange(gameday + 1)}>
          <SketchArrow direction="right" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.games}>
        {games === null
          ? <Text style={styles.loading}>Lädt…</Text>
          : games.map((game, index) => <GameCard key={game.id} game={game} index={index} bet={myBetsByGame[game.id]} isDoubleUsed={isDoubleUsed} onPick={onPick} onDouble={onDouble} />)}
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
