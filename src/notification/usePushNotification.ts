import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import httpRequest from "../utils/httpRequest"

export interface PushNotificationState {
    expoPushToken?: Notifications.ExpoPushToken;
    notification?: Notifications.Notification;
}

export const usePushNotifications = (): PushNotificationState => {
    const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();
    const [notification, setNotification] = useState<Notifications.Notification | undefined>();
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    // Configure notification handler
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: false, // Disable system alert
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });

    async function registerForPushNotificationsAsync() {
        let token;
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            console.log("1")
            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
                console.log("2")

            }
            console.log("3")


            if (finalStatus !== "granted") {
                alert("Failed to get push token for push notification");
                return;
            }
            token = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas.projectId,
            });
            console.log("Token from Expo API:", token);
        } else {
            console.log("4")
            alert("Must use physical device for Push Notifications");
        }

        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
                sound: "default",
            });
        }

        return token;
    }
    async function sendTokenToBackend(token: string): Promise<boolean> {
        try {
            const userId = await SecureStore.getItemAsync("userId");
            if (!userId) {
                console.log("User must be logged in to register push notifications");
                return false;
            }
            const storedToken = await SecureStore.getItemAsync("pushToken");
            if (storedToken !== token) {
                const response = await httpRequest("app/push-token", "POST", {
                    userId,
                    token
                });
                if (response && response.success) {
                    await SecureStore.setItemAsync("pushToken", token);
                    console.log("Push token updated successfully");
                    return true;
                } else {
                    console.error("Backend rejected push token update");
                    return false;
                }
            } else {
                console.log("Token is unchanged, no update needed");
                return true;
            }
        } catch (error) {
            console.error("Error updating push token:", error);
            return false;
        }
    }


    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            console.log(token.data)
            setExpoPushToken(token);
            if (token?.data === undefined){
                console.log("no token was found")
                return;
            }
            sendTokenToBackend(token.data).then(success => {
                if (!success) {
                    console.log("Failed to register push token with backend");
                }
            });

            console.log("Push Token:", token?.data);
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("Notification response:", response);
        });

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    return { expoPushToken, notification };
};