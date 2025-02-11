"use client"

import { useState } from "react"
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../navigation/AppNavigator";

type CalendarSubscriptionScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'ProfileScreen'
>;

export default function CalendarSubscriptionScreen() {
  const [selectedCalendars, setSelectedCalendars] = useState([0, 1, 2, 3])
  const [isSaving, setIsSaving] = useState(false)
  const navigation:CalendarSubscriptionScreenNavigationProp = useNavigation();
  const calendars = ["My personal calendar", "Lorem ipsum", "Lorem ipsum", "Lorem ipsum", "Lorem ipsum", "Lorem ipsum"]

  const handleGoBack = () => {
    navigation.goBack()
  }

  const toggleCalendar = (index: number) => {
    setSelectedCalendars((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Here you would typically make an API call to save the changes
      // const response = await api.updateCalendarSubscriptions(selectedCalendars);

      Alert.alert("Success", "Your calendar preferences have been saved successfully!", [
        {
          text: "OK",
          onPress: handleGoBack,
        },
      ])
    } catch (error) {
      Alert.alert("Error", "Failed to save changes. Please try again.", [{ text: "OK" }])
    } finally {
      setIsSaving(false)
    }
  }

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

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Select the calendars that you want to subscribe to.</Text>
      </View>

      {/* Calendar List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {calendars.map((calendar, index) => (
          <TouchableOpacity
            key={index}
            style={styles.calendarItem}
            onPress={() => toggleCalendar(index)}
            activeOpacity={0.7}
          >
            <View style={styles.calendarContent}>
              <View style={[styles.checkbox, selectedCalendars.includes(index) && styles.checkboxSelected]}>
                {selectedCalendars.includes(index) && <Ionicons name="checkmark" size={18} color="white" />}
              </View>
              <Text style={styles.calendarText}>{calendar}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges} disabled={isSaving} activeOpacity={0.9}>
          {isSaving ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
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
    fontSize: 24,
    lineHeight: 32,
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
    marginBottom: 12,
    borderRadius: 16,
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
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  calendarContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#20845A", // Updated to new color
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  checkboxSelected: {
    backgroundColor: "#20845A", // Updated to new color
    borderColor: "#20845A", // Updated to new color
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
    backgroundColor: "#1B7B5E", // Kept original color
    borderRadius: 12,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

