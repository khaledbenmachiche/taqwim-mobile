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
  Dimensions,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SecureStore from 'expo-secure-store';
import httpRequest from "../utils/httpRequest";
import Toast from "react-native-toast-message";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Calendar {
  id: string;
  summary: string;
  accessRole: string;
}

// @ts-ignore
type CalendarSubscriptionScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'ProfileScreen'
>;

export default function CalendarSubscriptionScreen() {
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const navigation = useNavigation<CalendarSubscriptionScreenNavigationProp>();
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [isFetchingCalendars, setIsFetchingCalendars] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkSignInStatus = async () => {
      const isSignedIn = await GoogleSignin.hasPreviousSignIn();
      setIsSignedIn(isSignedIn);
      if (isSignedIn) {
        await fetchGoogleToken();
        await fetchSelectedCalendars();
      }
    };

    checkSignInStatus();
  }, []);

  const fetchCalendars = async (accessToken: string) => {
    try {
      setIsFetchingCalendars(true);
      const response = await fetch(
          'https://www.googleapis.com/calendar/v3/users/me/calendarList',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
      );

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
        throw new Error('User is not signed in');
      }
      const data = await httpRequest(`/app/calendar/user/${id}`, "GET");
      setSelectedCalendars(data.map((item: any) => item.google_calendar_id));
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
        text2: 'Your calendar preferences have been saved.',
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
      setShowModal(false);
    } catch (error) {
      console.error('Google Sign-In error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to sign in with Google. Please try again.',
      });
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>My Calendars</Text>
          <View style={styles.backButton} />
        </View>

        {!isSignedIn ? (
            <View style={styles.notSignedInContainer}>
              <View style={styles.calendarIconContainer}>
                <Ionicons name="calendar-outline" size={40} color="#1B7B5E" />
                <View style={styles.checkmarkContainer}>
                  <Ionicons name="checkmark" size={20} color="white" />
                </View>
              </View>
              <Text style={styles.oopsText}>OOPS!</Text>
              <Text style={styles.noAccountText}>
                No Google Calendar Account linked.
              </Text>
              <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => setShowModal(true)}
              >
                <Text style={styles.linkButtonText}>Link my Google Calendar</Text>
              </TouchableOpacity>

              {/* Modal for Google Sign-in */}
              <Modal
                  visible={showModal}
                  animationType="slide"
                  transparent={true}
                  onRequestClose={() => setShowModal(false)}
              >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowModal(false)}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHandle} />
                      <Text style={styles.modalTitle}>Link Google Calendar</Text>
                      <Text style={styles.modalSubtitle}>
                        Connect to your gmail account that you want to use its calendar
                      </Text>
                      <TouchableOpacity
                          style={styles.googleSignInButton}
                          onPress={handleGoogleSignIn}
                      >
                        <Image
                            source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                            style={styles.googleIcon}
                        />
                        <Text style={styles.googleSignInText}>Sign in with Google</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
        ) : (
            <>
              <View style={styles.banner}>
                <Text style={styles.bannerText}>
                  Select the calendars that you want to subscribe to.
                </Text>
              </View>

              {isFetchingCalendars ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1B7B5E" />
                  </View>
              ) : (
                  <ScrollView
                      style={styles.scrollView}
                      contentContainerStyle={styles.scrollContent}
                      showsVerticalScrollIndicator={false}
                  >
                    {calendars.map((calendar) => (
                        <TouchableOpacity
                            key={calendar.id}
                            style={[
                              styles.calendarItem,
                              selectedCalendars.includes(calendar.id) && styles.calendarItemSelected
                            ]}
                            onPress={() => toggleCalendar(calendar.id)}
                            activeOpacity={0.7}
                        >
                          <View style={styles.calendarContent}>
                            <View
                                style={[
                                  styles.checkbox,
                                  selectedCalendars.includes(calendar.id) && styles.checkboxSelected
                                ]}
                            >
                              {selectedCalendars.includes(calendar.id) && (
                                  <Ionicons name="checkmark" size={18} color="white" />
                              )}
                            </View>
                            <Text style={styles.calendarText}>{calendar.summary}</Text>
                          </View>
                        </TouchableOpacity>
                    ))}
                  </ScrollView>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                      styles.saveButton,
                      (isSaving || selectedCalendars.length === 0) && styles.saveButtonDisabled
                    ]}
                    onPress={handleSaveChanges}
                    disabled={isSaving || selectedCalendars.length === 0}
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  notSignedInContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 120,
  },
  calendarIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#E5F0EC',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  checkmarkContainer: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    backgroundColor: '#1B7B5E',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  oopsText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  noAccountText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  linkButton: {
    backgroundColor: '#1B7B5E',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 100,
    width: '80%',
    alignItems: 'center',
  },
  linkButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 300,
  },
  modalContent: {
    padding: 24,
    alignItems: 'center',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  googleSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleSignInText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  banner: {
    backgroundColor: '#E5F0EC',
    padding: 16,
  },
  bannerText: {
    fontSize: 16,
    color: '#20845A',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  calendarItem: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  calendarItemSelected: {
    borderColor: '#20845A',
    backgroundColor: '#F0F9F6',
  },
  calendarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#20845A',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  checkboxSelected: {
    backgroundColor: '#20845A',
    borderColor: '#20845A',
  },
  calendarText: {
    fontSize: 16,
    color: '#1A1A1A',
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  saveButton: {
    backgroundColor: '#20845A',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#20845A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  saveButtonDisabled: {
    backgroundColor: '#A8C5B9',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});