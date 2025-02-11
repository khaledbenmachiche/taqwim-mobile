import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import AccountScreen from '../screens/AccountScreen';
import NotificationPreferencesScreen from '../screens/NotificationPreferencesScreen';
import SuccessScreen from "../screens/SuccessScreen";
import OnBoardingScreen from "../screens/OnBoardingScreen";

const Stack = createStackNavigator();

export type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  Login: undefined;
  Home: undefined;
  Account: undefined;
  ShareCalendar: undefined;
  NotificationPreferences: undefined;
  SuccessScreen: undefined;
  OnBoardingScreen:undefined;
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
