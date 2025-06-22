import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabSelected: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderColor: '#a855f7',
    borderWidth: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    alignItems: 'center',
  },
  tabUnselected: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#a855f7',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
  },
  tabTextSelected: {
    fontWeight: 'bold',
    color: '#000',
  },
  tabTextUnselected: {
    fontWeight: 'bold',
    color: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  courseList: {
    gap: 15,
    paddingBottom: 30,
  },
  courseCard: {
    borderWidth: 1,
    borderColor: '#a855f7',
    borderRadius: 10,
    padding: 15,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: '#444',
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f3e8ff',
    color: '#7e22ce',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 12,
    marginRight: 6,
    marginBottom: 5,
  },
  validateButton: {
    backgroundColor: '#a855f7',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  validateText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  laterText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#888',
  },
  createButton: {
    borderWidth: 1,
    borderColor: '#a855f7',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  
  createButtonText: {
    color: '#a855f7',
    fontWeight: 'bold',
  },
  courseCardSelected: {
    backgroundColor: '#f3e8ff', // léger violet de sélection
    borderColor: '#a855f7',
    borderWidth: 2,
  },
  empty: { textAlign:'center', color:'#666', marginTop:30 },

});
