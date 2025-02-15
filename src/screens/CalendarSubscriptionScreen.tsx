import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SecureStore from 'expo-secure-store';
import httpRequest from "../utils/httpRequest";
import Toast from "react-native-toast-message";

interface Calendar {
  id: string;
  summary: string;
  accessRole: string;
}

type CalendarSubscriptionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  //@ts-ignore
  'ProfileScreen'
>;

export default function CalendarSubscriptionScreen() {
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const navigation = useNavigation<CalendarSubscriptionScreenNavigationProp>();
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [isFetchingCalendars, setIsFetchingCalendars] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkSignInStatus = async () => {
      const isSignedIn = GoogleSignin.hasPreviousSignIn();
      setIsSignedIn(isSignedIn);
      if (isSignedIn) {
        fetchGoogleToken();
        fetchSelectedCalendars();
      }
    };

    checkSignInStatus();
  }, []);

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
      const filteredCalendars = data.items.filter((calendar: Calendar) => {
        return calendar.accessRole === 'owner';
      });

      setCalendars(filteredCalendars);
    } catch (error) {
      console.error(`Error fetching calendars: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setIsFetchingCalendars(false);
    }
  };

  const fetchGoogleToken = async () => {
    try {
      const { accessToken } = await GoogleSignin.getTokens();
      await fetchCalendars(accessToken);
    } catch (error) {
      console.error('Failed to get access token:', error);
    }
  };

  const fetchSelectedCalendars = async () => {
    try {
      const id = await SecureStore.getItemAsync('userId');
      if (!id) {
        throw new Error('Failed user is not signed in');
      }
      const data = await httpRequest(`/app/calendar/user/${id}`, "GET");
      //@ts-ignore
      setSelectedCalendars(data.map(item => item.google_calendar_id));
    } catch (e) {
      console.error('Failed to fetch selected calendars', e);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const toggleCalendar = (id: string) => {
    setSelectedCalendars((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const userId = await SecureStore.getItemAsync('userId');
      if (!userId) {
        throw new Error('User not signed in');
      }
  
      const response = await httpRequest(`/app/calendar/user/${userId}`, "POST", {
        selected_calendars: calendars
          .filter(item => selectedCalendars.includes(item.id))  
          .map(item => ({ google_calendar_id: item.id, summary: item.summary })) 
      });
      
  
      if (response.error) {
        throw new Error(response.error);
      }
  
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Your calendar preferences have been saved successfully.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save changes. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.signIn();
      const { accessToken } = await GoogleSignin.getTokens();
      setIsSignedIn(true);
      await fetchCalendars(accessToken);
    } catch (error) {
      console.error('Google Sign-In error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>My Calendars</Text>
        <View style={styles.backButton} /> {/* Spacer for centering */}
      </View>
      
      {!isSignedIn ? (
        <View style={styles.notSignedInContainer}>
          <Image source={{ uri: 'https://example.com/oops-image.png' }} style={styles.notSignedInImage} />
          <Text style={styles.notSignedInText}>OOOPPSS no calendars</Text>
          <TouchableOpacity style={styles.signInButton} onPress={handleGoogleSignIn}>
            <Text style={styles.signInButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Banner */}
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              Select the calendars that you want to subscribe to.
            </Text>
          </View>

          {/* Calendar List */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {calendars.map((calendar) => (
              <TouchableOpacity
                key={calendar.id}
                style={styles.calendarItem}
                onPress={() => toggleCalendar(calendar.id)}
                activeOpacity={0.7}
              >
                <View style={styles.calendarContent}>
                  <View
                    style={[styles.checkbox, selectedCalendars.includes(calendar.id) && styles.checkboxSelected]}
                  >
                    {selectedCalendars.includes(calendar.id) && (
                      <Ionicons name="checkmark" size={18} color="white" />
                    )}
                  </View>
                  {/* Display the calendar summary */}
                  <Text style={styles.calendarText}>{calendar.summary}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveChanges}
              disabled={isSaving}
              activeOpacity={0.9}
            >
              {isSaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 8 : 16,
    paddingBottom: 8,
    backgroundColor: "white",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
    marginHorizontal: 16,
  },
  banner: {
    backgroundColor: "#E5F0EC",
    padding: 24,
  },
  bannerText: {
    fontSize: 20,
    lineHeight: 28,
    color: "#000000",
    fontWeight: "400",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  calendarItem: {
    marginBottom: 14,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  calendarContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#20845A",
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  checkboxSelected: {
    backgroundColor: "#20845A",
    borderColor: "#20845A",
  },
  calendarText: {
    fontSize: 18,
    color: "#000000",
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    backgroundColor: "white",
  },
  saveButton: {
    backgroundColor: "#1B7B5E",
    borderRadius: 12,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  notSignedInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  notSignedInImage: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  notSignedInText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
    textAlign: "center",
  },
  signInButton: {
    backgroundColor: "#1B7B5E",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  signInButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});