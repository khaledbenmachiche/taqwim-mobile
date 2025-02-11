'use client';

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NotificationCard = () => (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      <View style={styles.leftContent}>
        <View style={styles.greenDot} />
        <View>
          <Text style={styles.timeText}>19:00-20:00</Text>
          <Text style={styles.titleText}>Workout with Ella</Text>
          <Text style={styles.descriptionText}>
            We will do the legs and back workout
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="ellipsis-horizontal" size={18} color="#94A3B8" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function Notifications({ navigation }) {
  const [activeTab, setActiveTab] = useState('notifications');

  const handleToggle = (tab) => {
    if (tab === 'profile') {
      navigation.navigate('ProfileScreen');
    }
    setActiveTab(tab);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <NotificationCard />
        <NotificationCard />
        <NotificationCard />
        <NotificationCard />
        <NotificationCard />
      </ScrollView>

      <View style={styles.toggleContainer}>
        <View style={styles.toggleWrapper}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === 'notifications' && styles.activeToggle,
            ]}
            onPress={() => handleToggle('notifications')}
          >
            <Ionicons
              name="notifications"
              size={18}
              color={activeTab === 'notifications' ? 'white' : '#1B7B5E'}
            />
            {activeTab === 'notifications' && (
              <Text style={styles.toggleText}>Notifications</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === 'profile' && styles.activeToggle,
            ]}
            onPress={() => handleToggle('profile')}
          >
            <Ionicons
              name="person"
              size={18}
              color={activeTab === 'profile' ? 'white' : '#1B7B5E'}
            />
            {activeTab === 'profile' && (
              <Text style={styles.toggleText}>Profile</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F8F9FA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginTop: 8,
  },
  timeText: {
    color: '#6B7280',
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '500',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  descriptionText: {
    color: '#94A3B8',
    fontSize: 16,
    lineHeight: 22,
  },
  menuButton: {
    padding: 4,
    marginLeft: 16,
    marginTop: 4,
  },
  toggleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  toggleWrapper: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  activeToggle: {
    backgroundColor: '#1B7B5E',
  },
  toggleText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
});