import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import AccountScreen from '../screens/AccountScreen';
import CalendarSharingScreen from '../screens/CalendarSharingScreen';
import NotificationPreferencesScreen from '../screens/NotificationPreferencesScreen';

import NotificationsScreen from '../screens/NotificationsScreen';
import MyAccountScreen from '../screens/MyAccountScreen'
import CalendarSubscription from '../screens/CalendarSubscription'
import SettingsScreen from '../screens/SettingsScreen'
import ProfileScreen from '../screens/ProfileScreen'
import Notifications from '../screens/Notifications'

const Stack = createStackNavigator();

export type RootStackParamList = {
  OnBoarding: undefined;
  Welcome: undefined;
  SignUp: undefined;
  Login: undefined;
  Home: undefined;
  Account: undefined;
  ShareCalendar: undefined;
  NotificationPreferences: undefined;
  Notifications: undefined;
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ProfileScreen">
            <Stack.Screen
                                                     name="Notifications"
                                                 component={Notifications}
                                                 options={{ headerShown: false }}
                                               />
           <Stack.Screen
                                     name="ProfileScreen"
                                     component={ProfileScreen}
                                     options={{ headerShown: false }}
                                   />
          <Stack.Screen
                           name="SettingsScreen"
                           component={SettingsScreen}
                           options={{ headerShown: false }}
                         />
          <Stack.Screen
                                     name="CalendarSubscription"
                                     component={CalendarSubscription}
                                     options={{ headerShown: false }}
                                   />
         <Stack.Screen
                  name="NotificationsScreen"
                  component={NotificationsScreen}
                  options={{ headerShown: false }}
                />

         <Stack.Screen
                           name="MyAccountScreen"
                           component={MyAccountScreen}
                           options={{ headerShown: false }}
                         />

        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Account"
          component={AccountScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ShareCalendar"
          component={CalendarSharingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotificationPreferences"
          component={NotificationPreferencesScreen}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;