// session.js
import AsyncStorage from '@react-native-async-storage/async-storage';


export const saveSession = async (tokenAccess, tokenRefresh, userId) => {
    await AsyncStorage.setItem('tokenAccess', tokenAccess);
    await AsyncStorage.setItem('tokenRefresh', tokenRefresh);
    await AsyncStorage.setItem('userId', userId);

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
    const tokenAccess = await AsyncStorage.getItem('tokenAccess');
    const tokenRefresh = await AsyncStorage.getItem('tokenRefresh');
    const userId = await AsyncStorage.getItem('userId');
    const statsString = await AsyncStorage.getItem('userStats');
    const stats = statsString ? JSON.parse(statsString) : null;

    return {
        tokenAccess: tokenAccess,
        tokenRefresh: tokenRefresh,
        userId: userId || null,
        stats,
    };
};

export const clearSession = async () => {
    await AsyncStorage.multiRemove(['tokenAccess',"tokenRefresh", 'userId','userStats']);
    console.log("Session cleard")
};
