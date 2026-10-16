import {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Game} from '../api/games';
import {Bet, Prediction} from '../api/bets';
import HandText from './sub/HandText';
import SketchRing from './sub/SketchRing';
import Smiley from './sub/Smiley';
import LiveDot from './sub/LiveDot';

type Props = {
  game: Game;
  index: number;
  // My bet on this game, if I placed one.
  bet: Bet | undefined;
  onPick: (game: Game, prediction: Prediction) => Promise<void>;
};

// Slightly different corners per card, like the league cards on Home.
const WOBBLES = [
  {borderTopLeftRadius: 18, borderTopRightRadius: 12, borderBottomRightRadius: 20, borderBottomLeftRadius: 14},
  {borderTopLeftRadius: 12, borderTopRightRadius: 20, borderBottomRightRadius: 14, borderBottomLeftRadius: 18},
  {borderTopLeftRadius: 20, borderTopRightRadius: 14, borderBottomRightRadius: 18, borderBottomLeftRadius: 12},
];

const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

// "Sa 18.10. · 15:30"
const formatKickoff = (matchTime: string) => {
  const date = new Date(matchTime);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${WEEKDAYS[date.getDay()]} ${pad(date.getDate())}.${pad(date.getMonth() + 1)}. · ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// German decimal comma, like the web app.
const formatOdds = (odds: number) => odds.toFixed(2).replace('.', ',');

// From this many points on (2x included), the smiley gets star eyes.
const BIG_WIN = 10;

const GREEN = '#2f6f4f';
const RED = '#b8322a';

// One game: kickoff, both teams with "vs" or the score, and the three odds.
const GameCard = ({game, index, bet, onPick}: Props) => {
  // True while a bet request is running, so a second tap can't send a second request.
  const [busy, setBusy] = useState(false);
  const hasStarted = new Date(game.matchTime).getTime() <= Date.now();
  const isLive = hasStarted && !game.isFinished;
  const hasOdds = game.oddsHome > 0 || game.oddsDraw > 0 || game.oddsAway > 0;

  // Once my bet is settled, the team I picked gets circled: green if I won, red if I lost. A draw pick has no team to circle.
  const isSettled = game.isFinished && bet !== undefined && bet.winnings !== null;
  const ringColor = isSettled && bet!.winnings! > 0 ? GREEN : RED;

  // Points line under the score: "+3,70", for a won 2x bet the odds with "2x" in front ("+2x1,85"), "+0" when lost.
  const won = isSettled && bet!.winnings! > 0;
  const pickedOdds = bet?.prediction === 'homeTeam' ? game.oddsHome : bet?.prediction === 'awayTeam' ? game.oddsAway : game.oddsDraw;
  const points = !won ? '+0' : bet!.isDouble ? `+2x${formatOdds(pickedOdds)}` : `+${formatOdds(bet!.winnings!)}`;
  const mood = !won ? 'sad' : bet!.winnings! >= BIG_WIN ? 'starry' : 'happy';

  const outcomes: {prediction: Prediction; odds: number}[] = [
    {prediction: 'homeTeam', odds: game.oddsHome},
    {prediction: 'draw', odds: game.oddsDraw},
    {prediction: 'awayTeam', odds: game.oddsAway},
  ];

  const pick = async (prediction: Prediction) => {
    setBusy(true);
    try {
      await onPick(game, prediction);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.card, WOBBLES[index % WOBBLES.length], game.isFinished && styles.finished]}>
      <View style={styles.top}>
        {/* While the game runs, "Live" takes the place of the kickoff; the right side stays free for tags like 2x. */}
        {isLive ? (
          <View style={styles.liveMark}>
            <LiveDot />
            <HandText style={styles.live}>Live</HandText>
          </View>
        ) : (
          <Text style={styles.when}>{formatKickoff(game.matchTime)}{game.isFinished && ' · Beendet'}</Text>
        )}
      </View>

      <View style={styles.teams}>
        <View style={[styles.side, styles.home]}>
          {isSettled && bet!.prediction === 'homeTeam'
            ? <SketchRing color={ringColor} tilt={-3}><Text style={styles.team} numberOfLines={2}>{game.homeTeam}</Text></SketchRing>
            : <Text style={styles.team} numberOfLines={2}>{game.homeTeam}</Text>}
        </View>
        {hasStarted
          ? <HandText style={styles.score}>{game.goalsHomeTeam} : {game.goalsAwayTeam}</HandText>
          : <HandText style={styles.vs}>vs</HandText>}
        <View style={[styles.side, styles.away]}>
          {isSettled && bet!.prediction === 'awayTeam'
            ? <SketchRing color={ringColor} tilt={2}><Text style={[styles.team, styles.awayText]} numberOfLines={2}>{game.awayTeam}</Text></SketchRing>
            : <Text style={[styles.team, styles.awayText]} numberOfLines={2}>{game.awayTeam}</Text>}
        </View>
      </View>

      {isSettled && (
        <View style={styles.result}>
          <HandText style={[styles.points, {color: won ? GREEN : RED}]}>{points}</HandText>
          <Smiley mood={mood} />
        </View>
      )}

      {/* Once the game is over there is nothing left to bet on. */}
      {game.isFinished ? null : hasOdds ? (
        <View style={[styles.odds, hasStarted && styles.oddsClosed]}>
          {outcomes.map(outcome => (
            // Betting closes at kickoff.
            <Pressable key={outcome.prediction} style={styles.option} disabled={hasStarted || busy} onPress={() => pick(outcome.prediction)}>
              {/* My pick gets a light green highlighter patch behind the odds, as in the design sheet. */}
              {bet?.prediction === outcome.prediction && <View style={styles.highlighter} />}
              <Text style={styles.optionOdds}>{formatOdds(outcome.odds)}</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <Text style={styles.noOdds}>Noch keine Quoten</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 14,
    padding: 14,
    backgroundColor: '#fffdf8',
    borderWidth: 2,
    borderColor: '#26262b',
  },
  // Past games fade back a little, so the open ones stand out.
  finished: {
    opacity: 0.55,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  when: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: '#5a5850',
  },
  liveMark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  live: {
    // Wider than the word needs, same Android Caveat clipping as the score.
    minWidth: 40,
    fontSize: 18,
    color: '#b8322a',
  },
  teams: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  side: {
    flex: 1,
  },
  team: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#26262b',
  },
  home: {
    alignItems: 'flex-start',
  },
  away: {
    alignItems: 'flex-end',
  },
  awayText: {
    textAlign: 'right',
  },
  vs: {
    fontSize: 22,
    color: '#9a978d',
  },
  score: {
    // Wider than the digits need and centered: Android measures Caveat too narrow and cuts off its right edge.
    minWidth: 72,
    textAlign: 'center',
    fontSize: 30,
    color: '#26262b',
  },
  result: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  points: {
    fontSize: 28,
  },
  odds: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#26262b',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 9,
    borderBottomLeftRadius: 7,
  },
  // Betting is closed once the game has started: the odds stay visible, but fade back.
  oddsClosed: {
    opacity: 0.5,
  },
  highlighter: {
    position: 'absolute',
    left: 5,
    right: 4,
    top: 7,
    bottom: 6,
    backgroundColor: 'rgba(186, 224, 140, 0.75)',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 3,
    borderBottomLeftRadius: 8,
    transform: [{rotate: '-2deg'}],
  },
  optionOdds: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: '#26262b',
  },
  noOdds: {
    marginTop: 12,
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#5a5850',
  },
});

export default GameCard;
