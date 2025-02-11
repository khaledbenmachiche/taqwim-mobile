import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SuccessScreen from "../screens/SuccessScreen";
import OnBoardingScreen from "../screens/OnBoardingScreen";
import MyAccountScreen from '../screens/MyAccountScreen';
import CalendarSubscriptionScreen from "../screens/CalendarSubscriptionScreen";
import SettingsScreen from '../screens/SettingsScreen';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

export type RootStackParamList = {
  OnBoardingScreen: undefined;
  SignUp: undefined;
  SuccessScreen: undefined;
  Login: undefined;
  MainTabs: undefined; // Add MainTabs route
  MyAccountScreen: undefined;
  CalendarSubscription: undefined;
  SettingsScreen: undefined;
};

const AppNavigator = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="OnBoardingScreen">
          {/* Authentication Screens */}
          <Stack.Screen
              name="OnBoardingScreen"
              component={OnBoardingScreen}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="SuccessScreen"
              component={SuccessScreen}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
          />

          {/* Main App Tabs */}
          <Stack.Screen
              name="MainTabs"
              component={TabNavigator}
              options={{ headerShown: false }}
          />

          {/* Additional Screens */}
          <Stack.Screen
              name="MyAccountScreen"
              component={MyAccountScreen}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="CalendarSubscription"
              component={CalendarSubscriptionScreen}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="SettingsScreen"
              component={SettingsScreen}
              options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default AppNavigator;