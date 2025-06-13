import {achievements} from './achievements';

export function checkAchievements(userStats, onUnlock) {
    const unlockedIds = userStats.unlockedAchievements
    console.log(userStats)
    achievements.forEach((achievement) => {
        const alreadyUnlocked = unlockedIds.includes(achievement.id);
        console.log(achievement.condition(userStats));
        // Si non encore débloqué et la condition est remplie
        if (!alreadyUnlocked && typeof achievement.condition === "function" && achievement.condition(userStats)) {
            onUnlock(achievement);
        }
    });
}