"use client"

import React, { useState, useEffect, useCallback } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform, Alert,ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import {useNavigation, useFocusEffect} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../navigation/AppNavigator";
import * as SecureStore from 'expo-secure-store';
import { User } from "lucide-react-native"
import httpRequest from "../utils/httpRequest";
import { useIsFocused } from '@react-navigation/native';
import Toast from "react-native-toast-message";

type MyAccountScreenNavigationProp = StackNavigationProp<
    RootStackParamList
>;
interface formDataType {
  firstName : string ,
  lastName : string ,
  email : string ,
  phone : string ,
  password ?: string ,
  id : string ,
  username : string ,}

export default function MyAccountScreen() {
  const navigation:MyAccountScreenNavigationProp = useNavigation();
  const [formData, setFormData] = useState <formDataType>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    id: "",
    username: "",
  });
  const isFocused = useIsFocused();
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9.%20Profile-li6E6VcQw3LrU3IPtu5I1uvVksnjj3.png",
  )
  const fetchProfile = useCallback(async () => {
    try {
      const phone = (await SecureStore.getItemAsync("userPhoneNumber")) ?? ""
      const email = (await SecureStore.getItemAsync("userEmail")) ?? ""
      const lastName = (await SecureStore.getItemAsync("userLastName")) ?? ""
      const firstName = (await SecureStore.getItemAsync("userFirstName")) ?? ""
      const id = (await SecureStore.getItemAsync("userId")) ?? ""
      const username = (await SecureStore.getItemAsync("userUsername")) ?? ""

      setFormData({ phone, email, lastName, firstName, id, username, password: "" })
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfile()
    }, [fetchProfile]),
  )


  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Sorry, we need camera roll permissions to change your picture!")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert("Error picking image")
    }
  }

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        ...formData,
        last_name: formData.lastName,
        first_name: formData.firstName,
        phone_number: formData.phone,
      }
      if (updatedData.password === "") {
        delete updatedData.password
      }
      const result = await httpRequest(`/app/user/${formData.id}`, "PUT", updatedData)

      await SecureStore.setItemAsync("userId", String(result.id) ?? "")
      await SecureStore.setItemAsync("userUsername", result.username ?? "")
      await SecureStore.setItemAsync("userEmail", result.email ?? "")
      await SecureStore.setItemAsync("userLastName", result.last_name ?? "")
      await SecureStore.setItemAsync("userFirstName", result.first_name ?? "")
      await SecureStore.setItemAsync("userPhoneNumber", result.phone_number ?? "")

      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Account updated successfully.",
      })
      await fetchProfile()
    } catch (e) {
      console.error("Error updating account:", e)
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update account. Please try again.",
      })
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Account</Text>
        <View style={styles.backButton} /> {/* Placeholder for alignment */}
      </View>

      {/* Profile Picture Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        </View>
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.changePictureText}>Change Picture</Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
      style={styles.scrollView} 
      contentContainerStyle={styles.scrollContainer} 
      showsVerticalScrollIndicator={true}
    > 
      {/* Form */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            placeholder="Enter your First Name"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            placeholder="Enter your Last Name"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={formData.username}
            onChangeText={(text) => setFormData({ ...formData, username: text })}
            placeholder="Enter your Username"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.input}>
            <Ionicons name="call" size={20} color="#1B7B5E" style={styles.phoneIcon} />
            <TextInput
              style={styles.phoneInput}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry={!showPassword}
              placeholder="Enter your password"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
      </ScrollView>
     <Toast/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  profileSection: {
    backgroundColor: "#E5F0EC",
    alignItems: "center",
    paddingVertical: 24,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    marginBottom: 16,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  changePictureText: {
    color: "#20845A",
    fontSize: 16,
    fontWeight: "500",
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#1E293B",
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  phoneIcon: {
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
  },
  passwordContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 16,
  },
  saveButton: {
    backgroundColor: "#20845A",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    position: "absolute",
    bottom: Platform.OS === "ios" ? 40 : 20,
    left: 0,
    right: 0,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 100, 
  },
  
})

