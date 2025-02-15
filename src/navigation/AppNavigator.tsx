import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, View, Alert } from 'react-native';
import httpRequest from '../utils/httpRequest';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SuccessScreen from '../screens/SuccessScreen';
import OnBoardingScreen from '../screens/OnBoardingScreen';
import MyAccountScreen from '../screens/MyAccountScreen';
import CalendarSubscriptionScreen from '../screens/CalendarSubscriptionScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TabNavigator from './TabNavigator';
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

const Stack = createStackNavigator();

export type RootStackParamList = {
  OnBoardingScreen: undefined;
  SignUp: undefined;
  SuccessScreen: undefined;
  Login: undefined;
  MainTabs: undefined;
  MyAccountScreen: undefined;
  CalendarSubscription: undefined;
  SettingsScreen: undefined;
  ForgotPasswordScreen: undefined;
};

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  const refreshToken = async () => {
    try {
      const userId = await SecureStore.getItemAsync('userId');
      if (!userId) return null;

    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userId = await SecureStore.getItemAsync('userId');
        if (!userId) {
          setInitialRoute('OnBoardingScreen');
          return;
        }
        setInitialRoute('MainTabs');
      } catch (error) {
        console.error('Error retrieving user session:', error);
        setInitialRoute('OnBoardingScreen');
      }
    };

    checkUserSession();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="MyAccountScreen" component={MyAccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CalendarSubscription" component={CalendarSubscriptionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
