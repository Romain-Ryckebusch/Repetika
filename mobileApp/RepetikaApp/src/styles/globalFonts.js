import { useFonts } from 'expo-font';


export function useGlobalFonts() {
  const [fontsLoaded] = useFonts({
    KronaOne_Regular: require('../assets/fonts/Krona_One/KronaOne-Regular.ttf'),
    OpenSans_Regular: require('../assets/fonts/Open_Sans/static/OpenSans-Regular.ttf'),
    OpenSans_Bold: require('../assets/fonts/Open_Sans/static/OpenSans-Bold.ttf'),
  });

  return fontsLoaded;
}