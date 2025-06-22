import React, { createContext, useState, useEffect } from 'react';


export const CreateCourseContext = createContext();

export const CreateCourseProvider = ({ children }) => {
    const [chapterList,setChapterList] = useState([]);
    const [currentChapterId, setCurrentChapterId] = useState(null);
    const [cardsListByChapter, setCardsListByChapter] = useState([]);
    const [courseTitle, setCourseTitle] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [pdfFile, setPdfFile] = useState(null);



    return (
        <CreateCourseContext.Provider value={{
            chapterList,setChapterList,
            currentChapterId,setCurrentChapterId,
            cardsListByChapter,setCardsListByChapter,
            courseTitle, setCourseTitle,
            courseDescription, setCourseDescription,
            pdfFile, setPdfFile,
        }}>
            {children}
        </CreateCourseContext.Provider>
    );
};
