import "./global.css";
import React,{ useState, useEffect, useRef } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { EventSubscription } from 'expo-modules-core';
import * as SecureStore from "expo-secure-store";
import registerForPushNotificationsAsync from "./src/utils/registerForPushNotificationsAsync";

const App: React.FC = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
  const notificationListener = useRef<EventSubscription | null>(null);
  const responseListener = useRef<EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token) => {
      setExpoPushToken(token);
      if (token != null) {
        await SecureStore.setItemAsync('expoPushToken', token);
      }
    });
    notificationListener.current = Notifications.addNotificationReceivedListener(
        (notification) => {
          console.log('Notification Received:', notification);
        }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          console.log('Notification Response:', response);
        }
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return <AppNavigator />;
};

export default App;