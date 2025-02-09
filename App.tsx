import "./global.css";
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants  from "expo-constants";

GoogleSignin.configure({
    webClientId: Constants.manifest.extra.googleWebClientId,
    scopes: [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/calendar', 
      'https://www.googleapis.com/auth/calendar.events',
       ],
    offlineAccess: true, 
    forceCodeForRefreshToken: false,
});

export default function App() {
  return (
    <AppNavigator />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
