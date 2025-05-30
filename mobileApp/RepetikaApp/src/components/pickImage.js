import * as ImagePicker from 'expo-image-picker';

/**
 * Ouvre la galerie et retourne l'URI de l'image sélectionnée, ou null si annulé.
 * @returns {Promise<string|null>}
 */
export async function pickImageAsync() {
  // Demande de permission
  const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!granted) {
    alert("Permission refusée pour accéder à la galerie.");
    return null;
  }

  // Ouvre la galerie
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 1,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0].uri;
}
