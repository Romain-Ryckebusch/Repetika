import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveSession = async (token) => {
    await AsyncStorage.setItem('userToken', token);
};

export const getSession = async () => {
    return await AsyncStorage.getItem('userToken');
};

export const clearSession = async () => {
    await AsyncStorage.removeItem('userToken');
};
