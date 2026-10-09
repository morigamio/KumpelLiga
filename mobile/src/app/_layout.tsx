import {Stack} from 'expo-router';

// Root navigator: every file in src/app/ is a screen. We draw our own headers, so the default one is hidden.
const RootLayout = () => {
  return <Stack screenOptions={{headerShown: false}} />;
};

export default RootLayout;
