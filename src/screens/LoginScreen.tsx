import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { signIn } from '../auth/auth';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';


import { useState } from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from "react-native"
import { ArrowLeft, EyeOff } from "lucide-react-native"


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
        //Alert.alert('Error', 'Please fill in all fields');
          Toast.show({
              type: 'error',
              text1: 'error!',
              text2: "Please fill in all fields",
          })
        return;
      }

      const result = await signIn({ username, password });
      if (!result.success && result.error) {
        // Alert.alert('Error', result.error);
        Toast.show({
              type: 'error',
              text1: 'error!',
              text2: result.error,
        })
        return;
      }

      Toast.show({
            type: 'success',
            text1: 'Success!',
            text2: 'Signed in successfully.',
      });

      await SecureStore.setItemAsync('userId', result.userInfo?.id ?? '');
      await SecureStore.setItemAsync('userUsername', result.userInfo?.username ?? '');
      await SecureStore.setItemAsync('userEmail', result.userInfo?.email ?? '');
      await SecureStore.setItemAsync('userLastName', result.userInfo?.lastName ?? '');
      await SecureStore.setItemAsync('userFirstName', result.userInfo?.firstName ?? '');
      await SecureStore.setItemAsync('userPhoneNumber', result.userInfo?.phoneNumber ?? '');

      navigation.navigate('Home');


      //Alert.alert('Success', 'Signed in successfully');


    } catch (error: any) {
      // Alert.alert('Error', error.message);
        Toast.show({
            type: 'error',
            text1: 'error!',
            text2: 'An error occurred.',
        })

    }
  };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={()=> navigation.goBack()}>
                <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>

            {/* Main Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Welcome Back 👋</Text>
                <Text style={styles.subtitle}>Sign to your account</Text>

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
                            keyboardType="email-address"
                            autoCapitalize="none"
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

                    <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.signInButton} onPress={handleSignInPress}>
                        <Text style={styles.signInButtonText}>Sign in</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={()=> navigation.navigate("SignUp")}>
                        <Text style={styles.signUpText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Toast/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
    forgotPassword: {
        color: "#2E8B57",
        fontSize: 16,
        fontWeight: "500",
    },
    signInButton: {
        backgroundColor: "#2E8B57",
        padding: 16,
        borderRadius: 100,
        alignItems: "center",
        marginTop: 20,
    },
    signInButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "auto",
        marginBottom: 40,
    },
    footerText: {
        color: "#666",
        fontSize: 16,
    },
    signUpText: {
        color: "#2E8B57",
        fontSize: 16,
        fontWeight: "500",
    },
})