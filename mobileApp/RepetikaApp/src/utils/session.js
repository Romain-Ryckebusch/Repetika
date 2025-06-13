// session.js
import AsyncStorage from '@react-native-async-storage/async-storage';


export const saveSession = async (token, user) => {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userId', user);

    const userStats = {
        friendCount: 1,
        studyStreak: 0,
        importedCourses: 0,
        createdCourses: 0,
        lastStudyDate: '2025/06/06',
        activeCourses: 0,
        name: 'Aymeric',
        unlockedAchievements: [],
    };

    await AsyncStorage.setItem('userStats', JSON.stringify(userStats));
};


export const getSession = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const user = await AsyncStorage.getItem('userId');
    const statsString = await AsyncStorage.getItem('userStats');
    const stats = statsString ? JSON.parse(statsString) : null;

    return {
        token,
        user: user || null,
        stats,
    };
};

export const clearSession = async () => {
    await AsyncStorage.multiRemove(['userToken', 'userId','userStats']);
};
