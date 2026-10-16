import {Pressable, StyleSheet, Text, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {League} from '../api/leagues';
import BuddyIcon from './sub/BuddyIcon';
import SketchArrow from './sub/SketchArrow';
import HandText from './sub/HandText';

type Props = {
  league: League;
  myName: string;
  index: number;
  onPress: () => void;
};

// Slightly different corners per card, so the list looks hand-drawn rather than copy-pasted.
const WOBBLES = [
  {borderTopLeftRadius: 18, borderTopRightRadius: 12, borderBottomRightRadius: 20, borderBottomLeftRadius: 14},
  {borderTopLeftRadius: 12, borderTopRightRadius: 20, borderBottomRightRadius: 14, borderBottomLeftRadius: 18},
  {borderTopLeftRadius: 20, borderTopRightRadius: 14, borderBottomRightRadius: 18, borderBottomLeftRadius: 12},
];

const LeagueCard = ({league, myName, index, onPress}: Props) => {
  const isMine = league.admin === myName;
  const members = league.participants.length;

  return (
    <Pressable style={[styles.card, WOBBLES[index % WOBBLES.length]]} onPress={onPress}>
      {isMine && (
        <Svg style={styles.crown} width={30} height={20} viewBox="0 0 30 20" fill="none">
          <Path
            d="M4 17 L 3 5 L 10 11 L 15 2 L 20 11 L 27 4 L 26 17 C 19 18, 11 18, 4 17"
            stroke="#2b4fb3"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
      <View style={styles.crest}>
        <HandText style={styles.crestLetter}>{league.name.charAt(0).toUpperCase()}</HandText>
      </View>
      <Text style={styles.name} numberOfLines={1}>{league.name}</Text>
      <View style={styles.members}>
        <BuddyIcon size={24} />
        <Text style={styles.membersCount}>{members}</Text>
      </View>
      <SketchArrow direction="right" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 76,
    marginTop: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fffdf8',
    borderWidth: 2,
    borderColor: '#26262b',
  },
  crown: {
    position: 'absolute',
    left: -12,
    top: -15,
    transform: [{rotate: '-28deg'}],
  },
  crest: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#26262b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 22,
    borderBottomLeftRadius: 20,
  },
  crestLetter: {
    fontSize: 26,
    color: '#2f6f4f',
  },
  name: {
    flex: 1,
    fontFamily: 'Nunito_700Bold',
    fontSize: 17,
    color: '#26262b',
  },
  members: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  membersCount: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#5a5850',
  },
});

export default LeagueCard;
