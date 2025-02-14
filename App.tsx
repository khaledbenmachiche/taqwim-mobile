import "./global.css";
import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Constants.manifest.extra.googleWebClientId,
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
      offlineAccess: true,
      forceCodeForRefreshToken: false,
    });
  }, []);
  return (
    <AppNavigator />
  );
}