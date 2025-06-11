import React, { createContext, useState, useEffect } from 'react';
import { getSession } from './session';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const loadToken = async () => {
            const storedToken = await getSession();
            if (storedToken) setToken(storedToken);
        };
        loadToken();
    }, []);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};
