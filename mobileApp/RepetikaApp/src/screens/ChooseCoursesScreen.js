import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/ChooseCoursesScreen.style';
import Fuse from 'fuse.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import useFetch from '../utils/useFetch';
import Config from "../config/config";
import { AuthContext } from '../utils/AuthContext';

const ChooseCoursesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const { t } = useTranslation();
  const { userId } = React.useContext(AuthContext); // récupération de l'utilisateur courant

  // Utilisation de useFetch pour récupérer les cours partagés
  const { data: apiCourses, loading, error, refetch } = useFetch(Config.BASE_URL+'/main/showAllSharedCourses');

  // Recherche floue sur les cours reçus de l'API
  const fuse = new Fuse(apiCourses || [], {
    keys: ['course_name', 'description', 'tags'],
    threshold: 0.3,
  });

  useEffect(() => {
    if (apiCourses) {
      setFilteredCourses(apiCourses);
    }
  }, [apiCourses]);

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

  const subscribeToCourses = async (selectedCourses) => {
    if (!userId) {
      console.error('Utilisateur non connecté.');
      return;
    }
    try {
      await Promise.all(
        selectedCourses.map(async (courseId) => {
          const course = (apiCourses || []).find(c => c.course_id === courseId);
          if (!course) return;
          console.log(encodeURIComponent(course));
          const url = `${Config.BASE_URL}/main/addToSubscribers?id_user=${encodeURIComponent(userId)}&course_name=${encodeURIComponent(course.course_name)}&author_id=${encodeURIComponent(course.author_id)}`;
          console.log(url);
          await fetch(url, { method: 'GET' });
        })
      );
    } catch (err) {
      console.error('Erreur lors de l\'abonnement aux cours :', err);
    }
  };

  const Validate = async (selectedCourses) => {
    await subscribeToCourses(selectedCourses);
    navigation.navigate('MainApp');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{t('chooseCoursesScreen.title')}</Text>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Chargement des cours...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{t('chooseCoursesScreen.title')}</Text>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Erreur lors du chargement des cours.</Text>
        </View>
      </SafeAreaView>
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
        {filteredCourses && filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <CourseCard
              key={course.course_id}
              title={course.course_name}
              description={course.description}
              tags={course.tags || []}
              selected={selectedCourses.includes(course.course_id)}
              onPress={() => toggleCourseSelection(course.course_id)}
            />
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Aucun cours trouvé.</Text>
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.validateButton}
        onPress={() => Validate(selectedCourses)}
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
