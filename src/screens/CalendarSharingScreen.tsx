import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import Constants  from 'expo-constants';
export default function CalendarSharingScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const navigation = useNavigation()
  
  const handleGoogleSignIn = async () => {
    try {
      const isSignedIn =  GoogleSignin.hasPreviousSignIn();
      if (!isSignedIn) {
        await GoogleSignin.signIn();
      }
      const { accessToken } = await GoogleSignin.getTokens();
      const userInfo =  GoogleSignin.getCurrentUser();
      setUserEmail(userInfo?.user.email || null);
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

  const shareCalendarWithServiceAccount = async (accessToken: string) => {
    try {
      const serviceAccountEmail = Constants.manifest.extra.apiBaseUrl;
      const calendarId = 'primary';
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/acl`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            scope: { type: 'user', value: serviceAccountEmail },
            role: 'reader',
          }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Calendar sharing failed: ${response.status} - ${errorBody}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Calendar sharing error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  const handleShareCalendar = async () => {
    setIsLoading(true);
    try {
      const accessToken = await handleGoogleSignIn();
      await shareCalendarWithServiceAccount(accessToken);
      Alert.alert('Success', 'Calendar shared successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to share calendar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
<View style={styles.backButtonContainer}>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
    <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/back.png' }} style={{ width: 24, height: 24 }} />
  </TouchableOpacity>
</View>

      <View style={styles.card}>
        <Text style={styles.title}>📅 Calendar Sharing</Text>
        <Text style={styles.subtitle}>Share your Google Calendar seamlessly.</Text>

        <Image
          source={{ uri: 'https://img.icons8.com/clouds/300/calendar.png' }}
          style={styles.image}
          resizeMode="contain"
        />

        {userEmail && (
          <View style={styles.userInfo}>
            <Text style={styles.emailText}>✅ Connected as: {userEmail}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleShareCalendar}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{userEmail ? 'Share Calendar' : 'Sign In with Google'}</Text>
          )}
        </TouchableOpacity>
      </View>
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
    textAlign: 'center',
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
});