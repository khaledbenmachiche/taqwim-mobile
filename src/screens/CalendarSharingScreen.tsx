import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import httpRequest from '../utils/httpRequest';
import shareCalendarWithServiceAccount from "../utils/shareCalendarWithServiceAccount";

interface Calendar {
  id: string;
  summary: string;
  description?: string;
}

export default function CalendarSharingScreen() {
  useEffect(()=>{
    GoogleSignin.configure({
          webClientId: Constants.manifest.extra.googleWebClientId,
          scopes: [
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/calendar', 
            'https://www.googleapis.com/auth/calendar.events',
             ],
          offlineAccess: true, 
          forceCodeForRefreshToken: false,
    });
  },[]);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [isFetchingCalendars, setIsFetchingCalendars] = useState(false);
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>([]);
  const navigation = useNavigation();
  const handleGoogleSignIn = async () => {
    try {
      const isSignedIn = GoogleSignin.hasPreviousSignIn();
      if (!isSignedIn) {
        await GoogleSignin.signIn();
      }
      const { accessToken } = await GoogleSignin.getTokens();
      const userInfo = GoogleSignin.getCurrentUser();
      setUserEmail(userInfo?.user.email || null);
      await fetchCalendars(accessToken);

      return accessToken;
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign in already in progress');
      } else {
        Alert.alert('Sign in error', error.toString());
      }
      throw error;
    }
  };

  const fetchCalendars = async (accessToken: string) => {
    try {
      setIsFetchingCalendars(true);
      const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to fetch calendars: ${response.status} - ${errorBody}`);
      }
      
      const data = await response.json();
      const filteredCalendars = data.items.filter((calendar: { accessRole: string }) => {
        return calendar.accessRole === "owner";
      });
  
      setCalendars(filteredCalendars);
    } catch (error) {
      throw new Error(`Error fetching calendars: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setIsFetchingCalendars(false);
    }
  };

  const handleSelectCalendar = (calendarId: string) => {
    setSelectedCalendarIds((prevSelected) =>
      prevSelected.includes(calendarId)
        ? prevSelected.filter((id) => id !== calendarId)
        : [...prevSelected, calendarId]
    );
  };
  

  const handleShareCalendars = async () => {
    if (selectedCalendarIds.length === 0) {
      Alert.alert('Please select at least one calendar');
      return;
    }
    setIsLoading(true);
    try {
      const accessToken = await handleGoogleSignIn();
      for (const calendarId of selectedCalendarIds) {
        try {
          await shareCalendarWithServiceAccount(accessToken, calendarId);
          const response = await httpRequest('/app/calendar/', 'POST', {
            google_calendar_id: calendarId,
            user_id: 6,
            summary: calendars.find((calendar) => calendar.id === calendarId)?.summary,
          });
  
          console.log(`Calendar ${calendarId} shared and saved successfully:`, response);
        } catch (error) {
          console.error(`Failed to process calendar ${calendarId}:`, error);
          throw error;
        }
      }
  
      Alert.alert('Success', 'Calendars shared and saved successfully!');
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to share calendars';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut();
      setUserEmail(null);
      setCalendars([]);
      setSelectedCalendarIds([]);
      Alert.alert('Success', 'Logged out successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/back.png' }} style={styles.backIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>📅 Calendar Sharing</Text>

        {userEmail ? (
          <>
            <View style={styles.userInfo}>
              <Text style={styles.emailText}>✅ Connected as: {userEmail}</Text>
            </View>

            {isFetchingCalendars ? (
              <ActivityIndicator size="large" color="#4285F4" />
            ) : (
              <>
                <Text style={styles.sectionTitle}>Select a Calendar</Text>
                <ScrollView style={styles.calendarList}>
                  {calendars.map((calendar) => (
                    <TouchableOpacity
                      key={calendar.id}
                      style={[
                        styles.calendarItem,
                        selectedCalendarIds.includes(calendar.id) && styles.selectedCalendarItem,
                      ]}
                      onPress={() => handleSelectCalendar(calendar.id)}
                    >
                      <Text style={styles.calendarSummary}>{calendar.summary}</Text>
                      {calendar.description && (
                        <Text style={styles.calendarDescription}>{calendar.description}</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>

              </>
            )}
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>Share your Google Calendar seamlessly.</Text>
            <Image
              source={{ uri: 'https://img.icons8.com/clouds/300/calendar.png' }}
              style={styles.image}
              resizeMode="contain"
            />
          </>
        )}

      <TouchableOpacity
        style={[styles.button, (isLoading || !userEmail) && styles.buttonDisabled]}
        onPress={userEmail ? handleShareCalendars : handleGoogleSignIn}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {userEmail ? 'Share Selected Calendars' : 'Sign In with Google'}
          </Text>
        )}
      </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
        disabled={!userEmail}
      >
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F4F8',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',c
    marginBottom: 16,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  userInfo: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  emailText: {
    color: '#1976D2',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  calendarList: {
    maxHeight: 200,
    width: '100%',
    marginBottom: 10,
  },
  calendarItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  selectedCalendarItem: {
    borderColor: '#4285F4',
    backgroundColor: '#E3F2FD',
  },
  calendarSummary: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  calendarDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    marginTop: 10,
  },
});