import {Stack} from 'expo-router';
import {useFonts} from 'expo-font';
import {Caveat_500Medium, Caveat_700Bold} from '@expo-google-fonts/caveat';
import {Nunito_400Regular, Nunito_700Bold} from '@expo-google-fonts/nunito';

// Root navigator: every file in src/app/ is a screen. We draw our own headers, so the default one is hidden.
// Fonts are loaded here once, so every screen can use them.
const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    Caveat_500Medium,
    Caveat_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  // No transition animation: every slide/fade variant flashed white or made Home jiggle on Android.
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: '#fffad9'},
        animation: 'none',
      }}
    />
  );
};

export default RootLayout;
