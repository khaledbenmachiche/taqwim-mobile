"use client"

import { useState } from "react"
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function SettingsScreen({ navigation }) {
  const [refreshTime, setRefreshTime] = useState(5)
  const [selectedApps, setSelectedApps] = useState(["SMS", "WhatsApp", "Telegram"])
  const [isEditing, setIsEditing] = useState(false)

  const apps = ["SMS", "WhatsApp", "Telegram", "Slack"]

  const incrementTime = () => {
    setRefreshTime((prev) => prev + 1)
    setIsEditing(false)
  }

  const decrementTime = () => {
    setRefreshTime((prev) => (prev > 1 ? prev - 1 : 1))
    setIsEditing(false)
  }

  const toggleApp = (app) => {
    setSelectedApps((prev) => (prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]))
  }
  const handleSaveChanges = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Here you would typically make an API call to save the changes
      // const response = await api.updateSettings({ refreshTime, selectedApps });

      Alert.alert("Success", "Your settings have been saved successfully!", [{ text: "OK" }])
    } catch (error) {
      Alert.alert("Error", "Failed to save changes. Please try again.", [{ text: "OK" }])
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Control the settings of your app!</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Refresh Time Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Refresh time</Text>
          <Text style={styles.sectionSubtitle}>Decide the frequency you want to load events with</Text>

          <View style={styles.timeControl}>
            <TouchableOpacity style={styles.timeButton} onPress={decrementTime}>
              <Text style={styles.timeButtonText}>-</Text>
            </TouchableOpacity>

            <View style={styles.timeDisplay}>
              <Text style={styles.timeNumber}>Every</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.timeValue, styles.timeInput]}
                  value={refreshTime.toString()}
                  onChangeText={(text) => {
                    if (text === "") {
                      setRefreshTime(0)
                    } else {
                      const num = Number.parseInt(text)
                      if (!isNaN(num)) {
                        setRefreshTime(num)
                      }
                    }
                  }}
                  keyboardType="number-pad"
                  onBlur={() => {
                    if (refreshTime === 0) {
                      setRefreshTime(1)
                    }
                    setIsEditing(false)
                  }}
                  autoFocus
                />
              ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Text style={styles.timeValue}>{refreshTime}</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.timeNumber}>Minutes</Text>
            </View>

            <TouchableOpacity style={styles.timeButton} onPress={incrementTime}>
              <Text style={styles.timeButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Apps Authorization Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apps Autorizations</Text>
          <Text style={styles.sectionSubtitle}>Choose the apps from which you want to receive notifications</Text>

          <View style={styles.appsList}>
            {apps.map((app) => (
              <TouchableOpacity key={app} style={styles.appItem} onPress={() => toggleApp(app)}>
                <View style={[styles.checkbox, selectedApps.includes(app) && styles.checkboxSelected]}>
                  {selectedApps.includes(app) && <Ionicons name="checkmark" size={16} color="white" />}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginRight: 28,
  },
  banner: {
    backgroundColor: "#E1EFE6",
    padding: 20,
  },
  bannerText: {
    fontSize: 22,
    color: "#000000",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 20,
  },
  timeControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  timeButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E1EFE6",
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  timeButtonText: {
    fontSize: 24,
    color: "#1B7B5E",
    fontWeight: "500",
  },
  timeDisplay: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  timeNumber: {
    fontSize: 16,
    color: "#666666",
  },
  timeValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1B7B5E",
    marginVertical: 4,
  },
  timeInput: {
    minWidth: 50,
    textAlign: "center",
  },
  appsList: {
    marginTop: 10,
  },
  appItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#1B7B5E",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#1B7B5E",
  },
  appName: {
    fontSize: 16,
    fontWeight: "500",
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  saveButton: {
    backgroundColor: "#1B7B5E",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    width: "100%",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

