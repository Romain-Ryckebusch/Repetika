// session.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveSession = async (token, user) => {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userId', user);
};

export const getSession = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const user = await AsyncStorage.getItem('userId');
    return {
        token,
        user: user ? user: null
    };
};

export const clearSession = async () => {
    await AsyncStorage.multiRemove(['userToken', 'userId']);
};
