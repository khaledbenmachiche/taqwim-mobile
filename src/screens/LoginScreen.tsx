import React, {useState} from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { signIn } from '../auth/auth';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignUp' | 'Home'
>;

export default function LoginScreen() {
  const navigation:LoginScreenNavigationProp = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignInPress = async () => {
    try {
      if (!username || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      const result = await signIn({ username, password });
      if (!result.success && result.error) {
        Alert.alert('Error', result.error);
        return;
      }

      Alert.alert('Success', 'Signed in successfully');

      await SecureStore.setItemAsync('userUsername', result.userInfo?.username ?? '');
      await SecureStore.setItemAsync('userEmail', result.userInfo?.email ?? '');
      await SecureStore.setItemAsync('userLastName', result.userInfo?.lastName ?? '');
      await SecureStore.setItemAsync('userFirstName', result.userInfo?.firstName ?? '');
      navigation.navigate('Home');

    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View className="flex-1 bg-white" style={{backgroundColor: "#0092ff"}}>
      <SafeAreaView  className="flex ">
        <View className="flex-row justify-start">
          <TouchableOpacity onPress={()=> navigation.goBack()} 
          className=" p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <View  className="flex-row justify-center">
            <Image source={require('../../assets/images/loginimg.png')} style={{width: 220, height: 200}} />
        </View>
      </SafeAreaView>
      <View 
        style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}} 
        className="flex-1 bg-white px-8 pt-8">
          <View className="form space-y-2">
            <Text className="text-gray-700 ml-4">Email Address</Text>
            <TextInput 
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <Text className="text-gray-700 ml-4">Password</Text>
            <TextInput 
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
              secureTextEntry
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity className="flex items-end">
              <Text className="text-gray-700 mb-5">Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="py-3 bg-blue-500 rounded-xl"
              onPress={handleSignInPress}
              >
                <Text 
                    className="text-xl font-bold text-center text-white"
                >
                        Login
                </Text>
             </TouchableOpacity>
            
          </View>

          <View className="flex-row justify-center mt-7">
              <Text className="text-gray-500 font-semibold">
                  Don't have an account?
              </Text>
              <TouchableOpacity onPress={()=> navigation.navigate('SignUp')}>
                  <Text className="font-semibold text-blue-500"> Sign Up</Text>
              </TouchableOpacity>
          </View>
          
      </View>
    </View>
    
  )
}