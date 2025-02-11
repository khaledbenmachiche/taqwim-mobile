import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

const NotificationCard = () => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftContent}>
          <View style={styles.greenDot}/>
          <View>
            <Text style={styles.timeText}>19:00-20:00</Text>
            <Text style={styles.titleText}>Workout with Ella</Text>
            <Text style={styles.descriptionText}>We will do the legs and back workout</Text>
          </View>
        </View>
      </View>
    </View>
);

export default function NotificationsScreen() {
  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={styles.headerText}>Notifications</Text>
        </View>

        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
          <NotificationCard />
          <NotificationCard />
          <NotificationCard />
          <NotificationCard />
          <NotificationCard />
          <NotificationCard />
          <NotificationCard />
          <NotificationCard />
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
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
    backgroundColor: "#10B981",
    marginTop: 8,
  },
  timeText: {
    color: "#6B7280",
    fontSize: 16,
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