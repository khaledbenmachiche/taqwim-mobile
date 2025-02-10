import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import React, {useEffect, useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { signUp } from '../auth/auth';

type SignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login' | 'ShareCalendar'
>;

export default function SignUpScreen() {
  const navigation: SignUpScreenNavigationProp = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{3,4}$/im;
    return re.test(phoneNumber);
  };

  const handleSignUpPress = async () => {
    try {
      // Check empty fields
      if (!firstName || !lastName || !username || !email || !phoneNumber || !password || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      // Validate email format
      if (!validateEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }
      // Validate phone number format
      if (!validatePhoneNumber(phoneNumber)) {
        Alert.alert('Error', 'Please enter a valid phone number');
        return;
      }
      // Check password match
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }



      console.log(email,username,firstName,lastName,phoneNumber,password);
      const result = await signUp({ email, username, firstName, lastName, phoneNumber, password });
      if (!result.success && result.error) {
        Alert.alert('Error', result.error);
        return;
      }
      Alert.alert('Success', 'Account created successfully');
      navigation.navigate('ShareCalendar');
      await SecureStore.setItemAsync('userEmail', email);
      await SecureStore.setItemAsync('userUsername', username);
      await SecureStore.setItemAsync('userFirstName', firstName);
      await SecureStore.setItemAsync('userLastName', lastName);
      await SecureStore.setItemAsync('userPhoneNumber', phoneNumber);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: '#0092ff' }}>
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center">
          <Image
            source={require('../../assets/images/signupimg.png')}
            style={{ width: 325, height: 110 }}
          />
        </View>
      </SafeAreaView>

      <View
        className="flex-1 bg-white px-8 pt-8"
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
      >
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-4">First Name</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter First Name"
          />

          <Text className="text-gray-700 ml-4">Last Name</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter Last Name"
          />

          <Text className="text-gray-700 ml-4">Username</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a Username"
            autoCapitalize="none"
          />

          <Text className="text-gray-700 ml-4">Email Address</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text className="text-gray-700 ml-4">Phone Number</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter Phone Number"
            keyboardType="phone-pad"
          />

          <Text className="text-gray-700 ml-4">Password</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="Enter Password"
          />

          <Text className="text-gray-700 ml-4">Confirm Password</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-7"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
          />

          <TouchableOpacity
            className="py-3 bg-blue-500 rounded-xl"
            onPress={handleSignUpPress}
          >
            <Text className="font-xl font-bold text-center text-white">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-7">
          <Text className="text-gray-500 font-semibold">
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="font-semibold text-blue-500"> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}