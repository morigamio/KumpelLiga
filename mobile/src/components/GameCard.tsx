import {StyleSheet, Text, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {Game} from '../api/games';

type Props = {
  game: Game;
  index: number;
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

// One game: kickoff, both teams with "vs" or the score, and the three odds.
const GameCard = ({game, index}: Props) => {
  const hasStarted = new Date(game.matchTime).getTime() <= Date.now();
  const isLive = hasStarted && !game.isFinished;
  const hasOdds = game.oddsHome > 0 || game.oddsDraw > 0 || game.oddsAway > 0;

  const outcomes = [
    {key: 'home', odds: game.oddsHome},
    {key: 'draw', odds: game.oddsDraw},
    {key: 'away', odds: game.oddsAway},
  ];

  return (
    <View style={[styles.card, WOBBLES[index % WOBBLES.length]]}>
      <View style={styles.top}>
        <Text style={styles.when}>{formatKickoff(game.matchTime)}</Text>
        {isLive && (
          <View style={styles.liveMark}>
            {/* A slightly lopsided blob, like a dot pressed on with a felt pen. */}
            <Svg width={12} height={12} viewBox="0 0 12 12">
              <Path d="M6 1.2 C 9.1 1, 11 3.4, 10.8 6.3 C 10.6 9.2, 8.2 11, 5.6 10.8 C 2.9 10.6, 1.1 8.5, 1.3 5.7 C 1.5 3, 3.4 1.4, 6 1.2" fill="#b8322a" />
            </Svg>
            <Text style={styles.live}>Live</Text>
          </View>
        )}
      </View>

      <View style={styles.teams}>
        <Text style={[styles.team, styles.home]} numberOfLines={2}>{game.homeTeam}</Text>
        {hasStarted
          ? <Text style={styles.score}>{game.goalsHomeTeam} : {game.goalsAwayTeam}</Text>
          : <Text style={styles.vs}>vs</Text>}
        <Text style={[styles.team, styles.away]} numberOfLines={2}>{game.awayTeam}</Text>
      </View>

      {hasOdds ? (
        <View style={styles.odds}>
          {outcomes.map(outcome => (
            <View key={outcome.key} style={styles.option}>
              <Text style={styles.optionOdds}>{formatOdds(outcome.odds)}</Text>
            </View>
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
    fontFamily: 'Caveat_700Bold',
    fontSize: 18,
    color: '#b8322a',
  },
  teams: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  team: {
    flex: 1,
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#26262b',
  },
  home: {
    textAlign: 'left',
  },
  away: {
    textAlign: 'right',
  },
  vs: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 22,
    color: '#9a978d',
  },
  score: {
    // Wider than the digits need and centered: Android measures Caveat too narrow and cuts off its right edge.
    minWidth: 72,
    textAlign: 'center',
    fontFamily: 'Caveat_700Bold',
    fontSize: 30,
    color: '#26262b',
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
    borderWidth: 1.5,
    borderColor: '#26262b',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 9,
    borderBottomLeftRadius: 7,
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
