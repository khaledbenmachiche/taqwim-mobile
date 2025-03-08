import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../navigation/AppNavigator";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';

const { height } = Dimensions.get("window");


type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "MyAccountScreen" | "CalendarSubscription" | "OnBoardingScreen"
>;

export default function ProfileScreen() {
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [profile, setProfile] = useState({ phone: "", lastName: "", firstName: "" });
  const slideAnim = useRef(new Animated.Value(height)).current;
  const navigation:ProfileScreenNavigationProp = useNavigation();
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const phone = await SecureStore.getItemAsync("userPhoneNumber")?? "";
        // const email = await SecureStore.getItemAsync("userEmail");
        const lastName = await SecureStore.getItemAsync("userLastName")?? "";
        const firstName = await SecureStore.getItemAsync("userFirstName")?? "";

        setProfile({ phone, lastName, firstName });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);
  useEffect(()=> {
    GoogleSignin.configure({
        webClientId: Constants.expoConfig?.extra?.googleWebClientId,
        scopes: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
        ],
        offlineAccess: true,
        forceCodeForRefreshToken: false,
    });
},[]);
  const showLogoutModal = () => {
    setIsLogoutVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const hideLogoutModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setIsLogoutVisible(false));
  };

  const handleLogout = async () => {
    try {
      const isSignedIn = GoogleSignin.hasPreviousSignIn();
      if (isSignedIn) {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
      }
      hideLogoutModal();
      await SecureStore.deleteItemAsync("googleCalendarAccessToken");
      await SecureStore.deleteItemAsync('userId');
      await SecureStore.deleteItemAsync('userUsername');
      await SecureStore.deleteItemAsync('userEmail');
      await SecureStore.deleteItemAsync('userLastName');
      await SecureStore.deleteItemAsync('userFirstName');
      await SecureStore.deleteItemAsync('userPhoneNumber');
      navigation.reset({
        index: 0,
        routes: [{ name: 'OnBoardingScreen' }],
      });
    }
    catch (error: any) {
      Toast.show({
          type: 'error',
          text1: 'Error!',
          text2: 'An error occurred while logging out.',
      });
      console.error("Logout error:", error);
  }
  };

  const menuItems = [
    {
      icon: "person",
      title: "My Account",
      onPress: () => navigation.navigate("MyAccountScreen"),
    },
    {
      icon: "calendar",
      title: "My calendars",
      onPress: () => navigation.navigate("CalendarSubscription"),
    },
    {
      icon: "settings",
      title: "Settings",
      onPress: () => navigation.navigate("SettingsScreen"),
    },
  ];

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
          <Text style={styles.headerTitle}>Profile</Text>

          <View style={styles.profileSection}>
            <View style={styles.profileInfo}>
              <Image
                  source={{
                    uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9.%20Profile-li6E6VcQw3LrU3IPtu5I1uvVksnjj3.png",
                  }}
                  style={styles.profileImage}
              />
              <View style={styles.profileText}>
                <Text style={styles.profileName}>{profile?.firstName + " " + profile?.lastName}</Text>
                <Text style={styles.profilePhone}>{profile?.phone}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={showLogoutModal}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuSection}>
            {menuItems.map((item, index) => (
                <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
                  <View style={styles.menuItemLeft}>
                    <View style={styles.iconContainer}>
                      <Ionicons name={item.icon as any} size={24} color="#20845A" />
                    </View>
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
                </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {isLogoutVisible && (
            <View style={styles.modalOverlay}>
              <TouchableOpacity style={styles.modalBackground} onPress={hideLogoutModal} activeOpacity={1} />
              <Animated.View
                  style={[
                    styles.logoutModal,
                    {
                      transform: [{ translateY: slideAnim }],
                    },
                  ]}
              >
                <View style={styles.logoutModalContent}>
                  <Text style={styles.logoutTitle}>Logout</Text>
                  <Text style={styles.logoutMessage}>Are you sure you want to logout?</Text>
                  <View style={styles.logoutButtons}>
                    <TouchableOpacity style={[styles.logoutButton, styles.cancelButton]} onPress={hideLogoutModal}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.logoutButton, styles.confirmButton]} onPress={handleLogout}>
                      <Text style={styles.confirmButtonText}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </View>
        )}
      <Toast/>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileText: {
    justifyContent: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  logoutText: {
    fontSize: 16,
    color: "#FF4444",
    fontWeight: "500",
  },
  menuSection: {
    marginTop: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: "500",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    zIndex: 999,
    elevation: 5,
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  logoutModal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  logoutModalContent: {
    alignItems: "center",
  },
  logoutTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  logoutMessage: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 24,
    textAlign: "center",
  },
  logoutButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  logoutButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  confirmButton: {
    backgroundColor: "#20845A",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});