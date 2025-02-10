import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView, ScrollView, Platform
} from 'react-native';
import React, {useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { signUp } from '../auth/auth';

import { ArrowLeft, EyeOff } from "lucide-react-native"
import Toast from "react-native-toast-message";

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
        // Alert.alert('Error', 'Please fill in all fields');
        Toast.show({
          type: 'error',
          text1: 'error!',
          text2: 'Please fill in all fields.',
        });
        return;
      }
      // Validate email format
      if (!validateEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        Toast.show({
          type: 'error',
          text1: 'error!',
          text2: 'Please enter a valid email address.',
        });
        return;
      }
      // Validate phone number format
      if (!validatePhoneNumber(phoneNumber)) {
        Alert.alert('Error', 'Please enter a valid phone number');
        Toast.show({
          type: 'error',
          text1: 'error!',
          text2: 'Please enter a valid phone number.',
        });
        return;
      }
      // Check password match
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        Toast.show({
          type: 'error',
          text1: 'error!',
          text2: 'Passwords do not match.',
        });
        return;
      }



      const result = await signUp({ email, username, firstName, lastName, phoneNumber, password });
      if (!result.success && result.error) {
        // Alert.alert('Error', result.error);
        Toast.show({
          type: 'error',
          text1: 'error!',
          text2: result.error,
        });
        return;
      }
      await SecureStore.setItemAsync('userId', result.userInfo?.id ?? '');
      await SecureStore.setItemAsync('userUsername', result.userInfo?.username ?? '');
      await SecureStore.setItemAsync('userEmail', result.userInfo?.email ?? '');
      await SecureStore.setItemAsync('userLastName', result.userInfo?.lastName ?? '');
      await SecureStore.setItemAsync('userFirstName', result.userInfo?.firstName ?? '');
      await SecureStore.setItemAsync('userPhoneNumber', result.userInfo?.phoneNumber ?? '');
      Alert.alert('Success', 'Account created successfully');
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Account created successfully.',
      });
      navigation.navigate('ShareCalendar');
    } catch (error: any) {
      Alert.alert('Error', error.message);
      Toast.show({
        type: 'error',
        text1: 'error!',
        text2: "An error occurred.",
      });
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={()=> navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Main Content */}
            <View style={styles.content}>
              <Text style={styles.title}>Sign Up</Text>
              <Text style={styles.subtitle}>Create account and choose your calendars</Text>

              {/* Form */}
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                      style={styles.input}
                      placeholder="Your username"
                      placeholderTextColor="#A0A0A0"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                  />
                </View>

                <View style={styles.rowContainer}>
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="First name"
                        placeholderTextColor="#A0A0A0"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                  </View>

                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Last name"
                        placeholderTextColor="#A0A0A0"
                        value={lastName}
                        onChangeText={setLastName}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                      style={styles.input}
                      placeholder="Your email"
                      placeholderTextColor="#A0A0A0"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                      style={styles.input}
                      placeholder="(+213) xxx-xxx-xx"
                      placeholderTextColor="#A0A0A0"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Your password"
                        placeholderTextColor="#A0A0A0"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.eyeIcon}>
                      <EyeOff size={20} color="#A0A0A0" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirm your password"
                        placeholderTextColor="#A0A0A0"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.eyeIcon}>
                      <EyeOff size={20} color="#A0A0A0" />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.createAccountButton} onPress={handleSignUpPress}>
                  <Text style={styles.createAccountButtonText}>Create an account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Have an account? </Text>
            <TouchableOpacity onPress={()=> navigation.navigate("Login")}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <Toast/>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    padding: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: "#666",
    marginBottom: 40,
  },
  form: {
    gap: 20,
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 16,
  },
  createAccountButton: {
    backgroundColor: "#2E8B57",
    padding: 16,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 20,
  },
  createAccountButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  footerText: {
    color: "#666",
    fontSize: 16,
  },
  signInText: {
    color: "#2E8B57",
    fontSize: 16,
    fontWeight: "500",
  },
})