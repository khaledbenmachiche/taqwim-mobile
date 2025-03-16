import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, Alert
} from "react-native";
import * as SecureStore from "expo-secure-store";
import httpRequest from "../utils/httpRequest";

interface NotificationCardProps {
  id: number;
  time: string;
  title: string;
  message: string;
}
function formatDate(dateString:string){
  const date = new Date(dateString);

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'long'
  }).format(date);
}


const NotificationCard: React.FC<NotificationCardProps> = ({ time, title, message }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftContent}>
          <View style={styles.greenDot} />
          <View>
            <Text style={styles.timeText}>{formatDate(time)}</Text>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.descriptionText}>{message}</Text>
          </View>
        </View>
      </View>
    </View>
);

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const id = (await SecureStore.getItemAsync("userId")) ?? ""
        const data = await httpRequest(`/app/event?user_id=${id}`);
        const notifications: NotificationCardProps[] = data.map((item: { id: number; start_time: string; summary: string; description: string; })=> {
          return {id: item.id, time: item.start_time, title: item.summary, message: (item.description || item.summary)}
        });
        setNotifications(notifications);
      } catch (error) {
        Alert.alert("Error", "Failed to load notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={styles.headerText}>Notifications</Text>
        </View>

        {loading ? (
            <ActivityIndicator size="large" color="#20845A" style={styles.loader} />
        ) : (
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
              {notifications.length > 0 ? (
                  notifications.map((notification) => (
                      <NotificationCard
                          key={notification.id}
                          id={notification.id}
                          time={notification.time}
                          title={notification.title}
                          message={notification.message}
                      />
                  ))
              ) : (
                  <Text style={styles.noNotifications}>No notifications available.</Text>
              )}
            </ScrollView>
        )}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
  },
  loader: {
    marginTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  noNotifications: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F8F9FA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: 12,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#20845A",
    marginTop: 8,
  },
  timeText: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "500",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  descriptionText: {
    color: "#94A3B8",
    fontSize: 16,
    lineHeight: 22,
  },
});

