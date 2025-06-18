// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getSession } from './session';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [tokenAccess, setTokenAccess] = useState(null);
    const [tokenRefresh, setTokenRefresh] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userStats, setUserStats] = useState(null);

    useEffect(() => {
        const loadSession = async () => {
            const session = await getSession();
            if (session.tokenAccess) setTokenAccess(session.tokenAccess);
            if(session.tokenRefresh) setTokenRefresh(session.tokenRefresh);
            if (session.userId) setUserId(session.userId);
            if (session.stats) setUserStats(session.stats);
        };
        loadSession();
    }, []);

    return (
        <AuthContext.Provider value={{
            tokenAccess, setTokenAccess,
            tokenRefresh, setTokenRefresh,
            userId, setUserId,
            userStats, setUserStats,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
