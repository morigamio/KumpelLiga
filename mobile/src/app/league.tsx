import {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Svg, {Ellipse} from 'react-native-svg';
import {router, useLocalSearchParams} from 'expo-router';
import PaperLines from '../components/sub/PaperLines';
import SketchFrame from '../components/sub/SketchFrame';
import {getLeague, League} from '../api/leagues';

const LeagueScreen = () => {
  const {id} = useLocalSearchParams<{id: string}>();
  const [league, setLeague] = useState<League | null>(null);
  const [activeTab, setActiveTab] = useState('Spiele');

  // Loads the league once when the screen opens (and again if the id changes).
  useEffect(() => {
    getLeague(id).then(setLeague).catch(() => setLeague(null));
  }, [id]);

  const changeView = (view: string) => {
    setActiveTab(view);
  };

  // The active tab gets a hand-drawn frame and dark ink, the others stay gray.
  const tabTextStyle = (view: string) => [styles.tabText, activeTab === view && styles.activeTabText];

  return (
    <View style={styles.screen}>
      <PaperLines />

      <View style={styles.topRow}>
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>‹ Meine Ligen</Text>
        </Pressable>
        <Pressable style={styles.options}>
          <Svg width={28} height={10} viewBox="0 0 28 10" fill="#26262b">
            <Ellipse cx={4} cy={5.5} rx={3.2} ry={3} />
            <Ellipse cx={14} cy={4.8} rx={3} ry={3.2} />
            <Ellipse cx={24} cy={5.3} rx={3.2} ry={3.1} />
          </Svg>
        </Pressable>
      </View>

      <View style={styles.titleRow}>
        <View style={styles.crest}>
          <Text style={styles.crestLetter}>{league ? league.name.charAt(0).toUpperCase() : ''}</Text>
        </View>
        <Text style={styles.name} numberOfLines={2}>{league ? league.name : 'Lädt…'}</Text>
      </View>

      <View style={styles.tabs}>
        <Pressable style={styles.tab} onPress={() => changeView('Spiele')}>{activeTab === 'Spiele' && <SketchFrame />}<Text style={tabTextStyle('Spiele')}>Spiele</Text></Pressable>
        <Pressable style={styles.tab} onPress={() => changeView('Tabelle')}>{activeTab === 'Tabelle' && <SketchFrame />}<Text style={tabTextStyle('Tabelle')}>Tabelle</Text></Pressable>
        <Pressable style={styles.tab} onPress={() => changeView('Verlauf')}>{activeTab === 'Verlauf' && <SketchFrame />}<Text style={tabTextStyle('Verlauf')}>Verlauf</Text></Pressable>
      </View>

      <Text style={styles.placeholder}>{activeTab}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 52,
    paddingHorizontal: 24,
    backgroundColor: '#fffad9',
  },
  topRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    height: 44,
    justifyContent: 'center',
  },
  backText: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 23,
    color: '#26262b',
  },
  options: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    minHeight: 68,
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  crest: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#26262b',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 22,
    borderBottomRightRadius: 26,
    borderBottomLeftRadius: 24,
  },
  crestLetter: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 30,
    color: '#2f6f4f',
  },
  name: {
    flex: 1,
    fontFamily: 'Caveat_700Bold',
    fontSize: 32,
    color: '#26262b',
  },
  tabs: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 6,
  },
  tab: {
    flex: 1,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    // The text box spans the whole tab: sized to the word alone, Android measures Caveat too narrow
    // and cuts off its right edge.
    alignSelf: 'stretch',
    textAlign: 'center',
    fontFamily: 'Caveat_700Bold',
    fontSize: 25,
    color: '#9a978d',
  },
  activeTabText: {
    color: '#26262b',
  },
  placeholder: {
    marginTop: 20,
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: '#5a5850',
  },
});

export default LeagueScreen;
