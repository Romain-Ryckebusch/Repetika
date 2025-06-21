import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/ChooseCoursesScreen.style';
import Fuse from 'fuse.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';


  
  

const ChooseCoursesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const { t } = useTranslation();

  const courses = [
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


    // Permet de filtrer les cours en fonction du titre
  // Ici, on utilise Fuse.js pour une recherche floue
  const fuse = new Fuse(courses, {
    keys: ['title'], // ou ['title', 'description', 'tags']
    threshold: 0.3,  // entre 0 (strict) et 1 (très tolérant)
  });

  useEffect(() => {
    setFilteredCourses(courses);
  }, []);

  //Pour normaliser le texte et supprimer les accents
// Cette fonction transforme le texte en minuscules, normalise les caractères accentués et sup
const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')              // transforme é -> é (lettre + accent séparés)
      .replace(/[\u0300-\u036f]/g, ''); // supprime les accents
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = fuse.search(normalizeText(query)).map(result => result.item);
      setFilteredCourses(filtered);

    } else {
      setFilteredCourses(courses);
    }
  };

  const toggleCourseSelection = (id) => {
    setSelectedCourses((prev) =>
      prev.includes(id)
        ? prev.filter((courseId) => courseId !== id) // déjà sélectionné -> on retire
        : [...prev, id]                              // pas encore sélectionné -> on ajoute
    );
  };
  const Validate = (selectedCourses) => {
    console.log('Cours sélectionnés :', selectedCourses)
    navigation.navigate('MainApp')
  };


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t("chooseCoursesScreen.title")}</Text>

     

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
      </ScrollView>

      <TouchableOpacity 
      style={styles.validateButton}
      onPress={() => Validate(selectedCourses)}
      >
        <Text style={styles.validateText}>{t("chooseCoursesScreen.validateButton")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('createCourseScreens')}>
        <Text style={styles.createButtonText}>{t("chooseCoursesScreen.createButton")}</Text>
       </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('MainApp')}>
        <Text style={styles.laterText}>{t("chooseCoursesScreen.laterButton")}</Text>
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
        {tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>{tag}</Text>
        ))}
      </View>
    </TouchableOpacity>
  );

export default ChooseCoursesScreen;
