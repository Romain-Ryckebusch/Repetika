// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getSession } from './session';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const loadSession = async () => {
            const session = await getSession();
            if (session.token) setToken(session.token);
            if (session.user) setUserId(session.user);
        };
        loadSession();
    }, []);

    return (
        <AuthContext.Provider value={{ token, setToken, userId, setUserId }}>
            {children}
        </AuthContext.Provider>
    );
};
