import {achievements} from './achievements';

export function checkAchievements(userStats, onUnlock) {
    if(userStats) {
        const unlockedIds = userStats.unlockedAchievements

        achievements.forEach((achievement) => {
            const alreadyUnlocked = unlockedIds.includes(achievement.id);
            // Si non encore débloqué et la condition est remplie
            if (!alreadyUnlocked && typeof achievement.condition === "function" && achievement.condition(userStats)) {
                onUnlock(achievement);
            }
        });
    }
}