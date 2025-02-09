import React, { useState } from "react";
import { SafeAreaView, View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const NotificationPreferencesScreen = () => {
  const navigation = useNavigation();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [telegramNotifications, setTelegramNotifications] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Preferences</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.text}>Push Notifications</Text>
          <Switch value={pushNotifications} onValueChange={setPushNotifications} trackColor={{ false: "#ddd", true: "#6C63FF" }} thumbColor={pushNotifications ? "#fff" : "#f4f3f4"} />
        </View>

        <View style={styles.row}>
          <Text style={styles.text}>Email Notifications</Text>
          <Switch value={emailNotifications} onValueChange={setEmailNotifications} trackColor={{ false: "#ddd", true: "#6C63FF" }} thumbColor={emailNotifications ? "#fff" : "#f4f3f4"} />
        </View>

        <View style={styles.row}>
          <Text style={styles.text}>SMS Notifications</Text>
          <Switch value={smsNotifications} onValueChange={setSmsNotifications} trackColor={{ false: "#ddd", true: "#6C63FF" }} thumbColor={smsNotifications ? "#fff" : "#f4f3f4"} />
        </View>

        <View style={styles.row}>
          <Text style={styles.text}>Telegram Notifications</Text>
          <Switch value={telegramNotifications} onValueChange={setTelegramNotifications} trackColor={{ false: "#ddd", true: "#6C63FF" }} thumbColor={telegramNotifications ? "#fff" : "#f4f3f4"} />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={() => alert("Changes saved!")}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9", paddingHorizontal: 20, paddingTop: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 22, fontWeight: "600", color: "#333", flex: 1, textAlign: "center" },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 25,
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default NotificationPreferencesScreen;