import {StyleSheet, Text, View} from 'react-native';
import PaperLines from '../components/PaperLines';

// Placeholder until the real Home screen (Meine Ligen) is built.
const HomeScreen = () => {
  return (
    <View style={styles.paper}>
      <PaperLines />
      <Text style={styles.title}>Hallo!</Text>
      <Text style={styles.text}>Hier kommen bald deine Ligen hin.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  paper: {
    flex: 1,
    backgroundColor: '#fffad9',
    paddingTop: 72,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 44,
    color: '#26262b',
  },
  text: {
    marginTop: 12,
    fontFamily: 'Nunito_400Regular',
    fontSize: 17,
    color: '#26262b',
  },
});

export default HomeScreen;
