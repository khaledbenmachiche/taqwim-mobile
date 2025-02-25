import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { usePushNotifications } from "./src/notification/usePushNotification";
import AppNavigator from './src/navigation/AppNavigator';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import { useEffect, useState } from 'react';
import { NotificationOverlay } from './src/componants/NotificationOverlay';

export default function App() {
    const { expoPushToken, notification } = usePushNotifications();
    const [visibleNotification, setVisibleNotification] = useState<{
        title?: string;
        body?: string;
    } | null>(null);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: Constants.expoConfig?.extra?.googleWebClientId,
            scopes: [
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/calendar.events',
            ],
            offlineAccess: true,
            forceCodeForRefreshToken: false,
        });
    }, []);

    useEffect(() => {
        if (notification) {
            setVisibleNotification({
                title: notification.request.content.title,
                body: notification.request.content.body
            });

            // Auto-clear notification after 5 seconds
            const timer = setTimeout(() => {
                setVisibleNotification(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            {/* Notification overlay first in render order */}
            {visibleNotification && (
                <NotificationOverlay
                    title={visibleNotification.title}
                    body={visibleNotification.body}
                    onHide={() => setVisibleNotification(null)}
                />
            )}

            <AppNavigator />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});