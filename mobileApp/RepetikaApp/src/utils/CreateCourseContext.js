import React, { createContext, useState, useEffect } from 'react';


export const CreateCourseContext = createContext();

export const CreateCourseProvider = ({ children }) => {
    const [chapterList,setChapterList] = useState([]);
    const [currentChapterId, setCurrentChapterId] = useState(null);
    const [cardsListByChapter, setCardsListByChapter] = useState([]);



    return (
        <CreateCourseContext.Provider value={{
            chapterList,setChapterList,
            currentChapterId,setCurrentChapterId,
            cardsListByChapter,setCardsListByChapter,
        }}>
            {children}
        </CreateCourseContext.Provider>
    );
};
