import { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { ArrowLeft } from "lucide-react-native";
import Toast from "react-native-toast-message";

// Define the navigation type
type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function ForgotPasswordScreen() {
    const navigation: ForgotPasswordScreenNavigationProp = useNavigation();
    const [email, setEmail] = useState("");

    const handleResetPasswordPress = async () => {
        try {
            if (!email) {
                Toast.show({
                    type: "error",
                    text1: "Error!",
                    text2: "Please enter your email address.",
                });
                return;
            }

            // Simulating API call
            const result = await fakePasswordResetAPI(email);

            if (!result.success) {
                Toast.show({
                    type: "error",
                    text1: "Error!",
                    text2: result.error || "Failed to send reset link.",
                });
                return;
            }

            Toast.show({
                type: "success",
                text1: "Success!",
                text2: "Password reset link sent to your email.",
            });

            // Navigate back to the login screen
            navigation.goBack();
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Error!",
                text2: "An unexpected error occurred.",
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>

            {/* Main Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>Enter your email address and we’ll send you a reset link.</Text>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email Address</Text>
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

                    <TouchableOpacity style={styles.resetButton} onPress={handleResetPasswordPress}>
                        <Text style={styles.resetButtonText}>Send Reset Link</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Toast />
        </SafeAreaView>
    );
}

const fakePasswordResetAPI = async (email: string) => {
    // Simulate an API call with a delay
    return new Promise((resolve) => {
        setTimeout(() => {
            if (email === "test@example.com") {
                resolve({ success: true });
            } else {
                resolve({ success: false, error: "Email not found." });
            }
        }, 1000);
    });
};

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
    resetButton: {
        backgroundColor: "#20845A",
        padding: 16,
        borderRadius: 100,
        alignItems: "center",
        marginTop: 20,
    },
    resetButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
