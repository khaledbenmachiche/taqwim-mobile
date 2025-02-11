import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SuccessScreen from "../screens/SuccessScreen";
import OnBoardingScreen from "../screens/OnBoardingScreen";

import NotificationsScreen from '../screens/NotificationsScreen';
import MyAccountScreen from '../screens/MyAccountScreen'
import CalendarSubscriptionScreen from "../screens/CalendarSubscriptionScreen";
import SettingsScreen from '../screens/SettingsScreen'
import ProfileScreen from '../screens/ProfileScreen'

const Stack = createStackNavigator();

export type RootStackParamList = {
  OnBoardingScreen: undefined;
  SignUp: undefined;
  SuccessScreen: undefined;
  Login: undefined;
  ProfileScreen: undefined;
  SettingsScreen: undefined;
  CalendarSubscription: undefined;
  NotificationsScreen:undefined;
  MyAccountScreen:undefined;
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CalendarSubscription" component={CalendarSubscriptionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MyAccountScreen" component={MyAccountScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;