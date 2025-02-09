import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, Switch, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type AccountScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NotificationPreferences' | 'Home'
>;


type UserDetails = {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  phone: string;
};

const AccountScreen = () => {
  const navigation:AccountScreenNavigationProp = useNavigation();
  const [userDetails, setUserDetails] = useState<UserDetails>({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    phone: "",
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const firstname = await SecureStore.getItemAsync("firstname");
        const lastname = await SecureStore.getItemAsync("lastname");
        const email = await SecureStore.getItemAsync("email");
        const username = await SecureStore.getItemAsync("username");
        const phone = await SecureStore.getItemAsync("phone");

        setUserDetails({
          firstname: firstname || "",
          lastname: lastname || "",
          email: email || "",
          username: username || "",
          phone: phone || "",
        });
      } catch (error) {
        console.error("Failed to load user details:", error);
      }
    };

    loadUserData();
  }, []);

  const handleUpdateDetails = async () => {
    try {
      await SecureStore.setItemAsync("firstname", userDetails.firstname);
      await SecureStore.setItemAsync("lastname", userDetails.lastname);
      await SecureStore.setItemAsync("email", userDetails.email);
      await SecureStore.setItemAsync("username", userDetails.username);
      await SecureStore.setItemAsync("phone", userDetails.phone);
      console.log("User details saved securely!");
    } catch (error) {
      console.error("Error saving user details:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={userDetails.firstname}
              onChangeText={(text) => setUserDetails((prev) => ({ ...prev, firstname: text }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={userDetails.lastname}
              onChangeText={(text) => setUserDetails((prev) => ({ ...prev, lastname: text }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={userDetails.email}
              onChangeText={(text) => setUserDetails((prev) => ({ ...prev, email: text }))}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={userDetails.username}
              onChangeText={(text) => setUserDetails((prev) => ({ ...prev, username: text }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={userDetails.phone}
              onChangeText={(text) => setUserDetails((prev) => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateDetails}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.notificationButton} 
            onPress={() => navigation.navigate("NotificationPreferences")}
          >
            <Text style={styles.notificationButtonText}>Notification Preferences</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 20 },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#333" },
  section: { backgroundColor: "#f8f9fa", borderRadius: 12, padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 15 },
  inputGroup: { marginBottom: 20 },
  label: { color: "#666", fontSize: 14, marginBottom: 8 },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 12, fontSize: 16, borderWidth: 1, borderColor: "#e9ecef" },
  saveButton: { backgroundColor: "#6C63FF", borderRadius: 8, padding: 16, alignItems: "center", marginTop: 10 },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  notificationButton: { backgroundColor: "#4CAF50", borderRadius: 8, padding: 16, alignItems: "center", marginTop: 10 },
  notificationButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default AccountScreen;