

export const XpAllDataFunction =(xp)=>{
    const level = XpToLevelFunction(xp)
    const nextLevel = level+1;
    const xpLevel = LevelToXpFunction(level)
    const xpNextLevel = LevelToXpFunction(nextLevel)
    const deltaXp = xpNextLevel-xpLevel;
    const progress = (xp - xpLevel) / deltaXp;
    return {
        level:level,
        nextLevel: nextLevel,
        progress:progress,
    }
}


export const XpGetNextLevel = (xp)=>{
    return XpToLevelFunction(xp)+1;
}

export const XpGretProgression = (xp)=>{
    const level = XpToLevelFunction(xp)
    const nextLevel = level+1;
    const xpLevel = LevelToXpFunction(level)
    const xpNextLevel = LevelToXpFunction(nextLevel)
    const deltaXp = xpNextLevel-xpLevel;
    return (xp - xpLevel) / deltaXp;
}

export const LevelToXpFunction=(lvl)=>{
    return Math.round(10 * (lvl ** 2));
}

export const XpToLevelFunction=(xp)=>{
    return Math.floor(Math.sqrt(xp / 10));
}