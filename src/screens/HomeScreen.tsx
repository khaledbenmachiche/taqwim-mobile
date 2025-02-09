import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login' | 'SignUp'
>;

const HomePage = () => {
  const navigation:HomeScreenNavigationProp = useNavigation();
  const upcomingEvents = [
    { 
      id: '1', 
      title: 'Tech Conference 2024', 
      date: 'March 15, 2024', 
      location: 'Convention Center', 
      image: 'https://source.unsplash.com/300x300/?conference',
      category: 'Conference'
    },
    { 
      id: '2', 
      title: 'Summer Music Festival', 
      date: 'June 20, 2024', 
      location: 'Central Park', 
      image: 'https://source.unsplash.com/300x300/?music-festival',
      category: 'Concert'
    },
    { 
      id: '3', 
      title: 'Business Workshop', 
      date: 'April 5, 2024', 
      location: 'Downtown Hub', 
      image: 'https://source.unsplash.com/300x300/?workshop',
      category: 'Seminar'
    },
  ];

  const categories = [
    { id: '1', name: 'Conferences', icon: 'business-outline' },
    { id: '2', name: 'Concerts', icon: 'musical-notes-outline' },
    { id: '3', name: 'Workshops', icon: 'school-outline' },
    { id: '4', name: 'Sports', icon: 'barbell-outline' },
    { id: '5', name: 'Meetups', icon: 'people-outline' },
    { id: '6', name: 'Parties', icon: 'wine-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#6C63FF', '#8B7FFC']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Your Events</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Account')} style={styles.iconButton}>
              <Ionicons name="person-outline" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="calendar-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              placeholder="Search events..."
              style={styles.searchInput}
              placeholderTextColor="#666"
            />
          </View>
        </LinearGradient>

        {/* Upcoming Events */}
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {upcomingEvents.map((event) => (
            <TouchableOpacity key={event.id} style={styles.eventCard}>
              <Image source={{ uri: event.image }} style={styles.eventImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.eventGradient}
              >
                <View style={styles.eventTag}>
                  <Text style={styles.eventTagText}>{event.category}</Text>
                </View>
                <Text style={styles.eventDate}>{event.date}</Text>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventLocation}>
                  <Ionicons name="location-outline" size={16} color="#fff" />
                  <Text style={styles.eventLocationText}>{event.location}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    margin: 20,
  },
  eventCard: {
    width: 280,
    height: 350,
    borderRadius: 20,
    marginRight: 20,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  eventGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    height: '60%',
    justifyContent: 'flex-end',
  },
  eventTag: {
    backgroundColor: '#6C63FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 10,
  },
  eventTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  eventDate: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 5,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocationText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  createEventButton: {
    flexDirection: 'row',
    backgroundColor: '#6C63FF',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  createEventText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
});

export default HomePage;