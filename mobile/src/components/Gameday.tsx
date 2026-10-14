import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import SketchArrow from './sub/SketchArrow';

type Props = {
  gameday: number | null;
  gamedayCount: number | null;
  onChange: (gameday: number) => void;
};

// One Gameday: a switcher row to step between gamedays, then all games to that gameday as card components.
const Gameday = ({gameday, gamedayCount, onChange}: Props) => {
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

      <ScrollView contentContainerStyle={styles.games} />
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
});

export default Gameday;
