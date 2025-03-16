import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import Toast from "react-native-toast-message";
import * as SecureStore from 'expo-secure-store';
import httpRequest from "../utils/httpRequest";

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface AuthApp {
  name: string;
  id: number;
}

export default function SettingsScreen() {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const apps = ["SMS", "WhatsApp", "Push", "Telegram"];

  const navigation: SettingsScreenNavigationProp = useNavigation();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const userId = await SecureStore.getItemAsync("userId");
        if (!userId) {
          throw new Error("User ID not found in SecureStore");
        }
        setId(userId);
        const data = await httpRequest(`/app/user/${userId}`, "GET");
        setSelectedApps(data.authorizations.map((item: AuthApp) => item.name));
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchApps();
  }, []);

  const enableTelegram = async () => {
    try {
      const botUsername = "ICSProjectBot";
      const username = await SecureStore.getItemAsync("userUsername");

      if (!username) {
        throw new Error("Username not found");
      }
      const telegramLink = `https://t.me/${botUsername}?start=${encodeURIComponent(username)}`;
      console.log("Generated Telegram Link:", telegramLink);
      const supported = await Linking.canOpenURL(telegramLink);
      if (supported) {
        await Linking.openURL(telegramLink);
      } else {
        Alert.alert("Telegram is not installed.");
      }
    } catch (error: any) {
      console.error("Error enabling Telegram:", error);
      Alert.alert("Failed to link Telegram", error.message);
    }
  };

  const toggleApp = async (app: string) => {
    if (!selectedApps.includes(app) && app === 'Telegram') {
      await enableTelegram();
    }
    setSelectedApps((prev) =>
        prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  const handleSaveChanges = async () => {
    try {
      await httpRequest(`/app/user/${id}`, "PUT", { "authorization_methods": selectedApps });

      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Your settings have been saved successfully!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save changes. Please try again.",
      });
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.backButton} />
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Control the settings of your app!</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Apps Authorization Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Apps Authorizations</Text>
            <Text style={styles.sectionSubtitle}>
              Choose the apps from which you want to receive notifications
            </Text>

            <View style={styles.appsList}>
              {apps.map((app) => (
                  <TouchableOpacity
                      key={app}
                      style={[
                        styles.appItem,
                        selectedApps.includes(app) && styles.appItemSelected,
                      ]}
                      onPress={() => toggleApp(app)}
                  >
                    <View style={[
                      styles.checkbox,
                      selectedApps.includes(app) && styles.checkboxSelected
                    ]}>
                      {selectedApps.includes(app) && (
                          <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                    <Text style={styles.appName}>{app}</Text>
                  </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: "#E5E9F0",
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
    color: "#000000",
    textAlign: "center",
  },
  banner: {
    backgroundColor: "#E5F0EC",
    padding: 16,
  },
  bannerText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1B7B5E",
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 16,
  },
  appsList: {
    marginTop: 8,
  },
  appItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E9F0",
  },
  appItemSelected: {
    backgroundColor: "#F0F9F6",
    borderColor: "#20845A",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#20845A",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#20845A",
  },
  appName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
    flex: 1,
  },
  appIcon: {
    marginLeft: 8,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E9F0",
  },
  saveButton: {
    backgroundColor: "#20845A",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});