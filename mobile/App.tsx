import {StyleSheet, Text, View} from 'react-native';
import {useFonts} from 'expo-font';
import {Caveat_500Medium, Caveat_700Bold} from '@expo-google-fonts/caveat';
import {Nunito_400Regular, Nunito_700Bold} from '@expo-google-fonts/nunito';

const LINE_SPACING = 36;
const LINE_COUNT = 40;

const App = () => {
  const [fontsLoaded] = useFonts({
    Caveat_500Medium,
    Caveat_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.paper}>
      {Array.from({length: LINE_COUNT}, (_, i) => (
        <View key={i} style={[styles.line, {top: (i + 1) * LINE_SPACING - 1}]} />
      ))}
      <Text style={styles.title}>
        Kumpel<Text style={styles.titleAccent}>Liga</Text>
      </Text>
      <Text style={styles.slogan}>Wette mit Spaß, nicht mit Geld.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  paper: {
    flex: 1,
    backgroundColor: '#fffad9',
    paddingTop: 72,
    paddingHorizontal: 32,
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#e4e2da',
  },
  title: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 58,
    color: '#26262b',
    textAlign: 'center',
  },
  titleAccent: {
    color: '#2f6f4f',
  },
  slogan: {
    fontFamily: 'Caveat_500Medium',
    fontSize: 24,
    color: '#4a4943',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default App;
