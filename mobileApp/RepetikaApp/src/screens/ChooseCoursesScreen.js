import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/ChooseCoursesScreen.style';
import Fuse from 'fuse.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import useFetch from '../utils/useFetch';
import Config from "../config/config";
import { AuthContext } from '../utils/AuthContext';
import config from "../config/config";
import { CommonActions } from '@react-navigation/native';
import { useContext } from 'react';
import { useMemo } from 'react';


  
  

const ChooseCoursesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const { t } = useTranslation();
  const { userId } = React.useContext(AuthContext); // récupération de l'utilisateur courant

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log('User ID:', userId);

  /*
   courses = [
    {
      id: 1,
      title: "Histoire de 1945 à nos jours",
      description: "De la fin de la seconde guerre mondiale aux tensions actuelles...",
      tags: ['Histoire', 'Géo', 'Actualité']
    },
    {
      id: 2,
      title: "Numéros des départements Français",
      description: "Apprends les numéros de tous les départements Français",
      tags: ['Géographie']
    }
  ];
  */
  
  


    // Permet de filtrer les cours en fonction du titre
  // Ici, on utilise Fuse.js pour une recherche floue
  const fuse = useMemo( () => new Fuse(courses, {
    keys: ['title'], // ou ['title', 'description', 'tags']
    threshold: 0.3,  // entre 0 (strict) et 1 (très tolérant)
  }), 
  [courses]
  );

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(config.BASE_URL + '/api/cours/showAllSharedCourses'); // remplace par ton URL réelle
        const data = await response.json();

        const formatted = data.map(c => ({
          id:          c.course_id,
          title:       c.course_name,
          authorId:    c.author_id,
          description: c.description,
          tags:        c.tags || []
        }));

        setCourses(formatted);
        setFilteredCourses(formatted);
      } catch (error) {
        console.error('Erreur lors du fetch des cours :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const normalizeText = (text) => {
    return text
      ? text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      : '';
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query && apiCourses) {
      const filtered = fuse.search(normalizeText(query)).map(result => result.item);
      setFilteredCourses(filtered);
    } else if (apiCourses) {
      setFilteredCourses(apiCourses);
    }
  };

  const toggleCourseSelection = (id) => {
    setSelectedCourses((prev) =>
      prev.includes(id)
        ? prev.filter((courseId) => courseId !== id)
        : [...prev, id]
    );
  };




  const Validate =async () => {
    console.log('Cours sélectionnés :', selectedCourses)
    


    if (selectedCourses.length === 0) return;      // nothing to send

    try {
      // fire all requests in parallel – each returns a simple 200/400
      await Promise.all(
        selectedCourses.map(async courseId => {
          // find the course object we kept
          const course = courses.find(c => c.id === courseId);
          if (!course) return;
  
          const qs = new URLSearchParams({
            id_user:     userId,
            course_name: course.title,
            author_id:   course.authorId
          }).toString();
  
          const res = await fetch(
            `${config.BASE_URL}/addToSubscribers?${qs}`
          );
  
          if (!res.ok) {
            console.warn('AddToSubscribers failed for', course.title);
          }
        })
      );
  
      
     /* //  when everything is done, go back to Home/AppTabs
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AppTabs' }]
        })
      );*/
      navigation.navigate('MainApp', { screen: 'Home' });
    } catch (err) {
      console.error('Validate error', err);
    }
  
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A259FF" />
        <Text>{t('loading')}...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('chooseCoursesScreen.title')}</Text>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder=" "
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <Ionicons name="search" size={20} color="#999" />
      </View>
      <ScrollView contentContainerStyle={styles.courseList}>
        {filteredCourses.map(course => (
          <CourseCard
            key={course.id}
            title={course.title}
            description={course.description}
            tags={course.tags}
            selected={selectedCourses.includes(course.id)}
            onPress={() => toggleCourseSelection(course.id)}
          />
        ))}
        {filteredCourses.length === 0 && (
          <Text style={styles.empty}>{t('courseSelectionScreen.noResults')}</Text>
        )}
      </ScrollView>

      <TouchableOpacity 
      style={styles.validateButton}
      onPress={Validate}
      >
        <Text style={styles.validateText}>{t('chooseCoursesScreen.validateButton')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('createCourseScreens')}>
        <Text style={styles.createButtonText}>{t('chooseCoursesScreen.createButton')}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MainApp')}>
        <Text style={styles.laterText}>{t('chooseCoursesScreen.laterButton')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const CourseCard = ({ title, description, tags, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.courseCard, selected && styles.courseCardSelected]}
    onPress={onPress}
  >
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
    <View style={styles.tagContainer}>
      {Array.isArray(tags) && tags.map((tag, index) => (
        <Text key={index} style={styles.tag}>{tag}</Text>
      ))}
    </View>
  </TouchableOpacity>
);

export default ChooseCoursesScreen;
