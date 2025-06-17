
import React, { createContext, useState, useEffect } from 'react';
import { getSession } from './session';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
    const [currentDeckId,setCurrentDeckId] = useState(null);
    const [currentCoursId, setCurrentCoursId] = useState(null);



    return (
        <CourseContext.Provider value={{
            currentDeckId,setCurrentDeckId,
            currentCoursId,setCurrentCoursId,
        }}>
            {children}
        </CourseContext.Provider>
    );
};
