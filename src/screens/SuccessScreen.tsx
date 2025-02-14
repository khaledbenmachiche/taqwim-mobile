import {useEffect, useState} from "react";
import {Alert, Image, Modal, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Calendar, Check} from "lucide-react-native";
import {useNavigation} from "@react-navigation/native";
import {GoogleSignin, statusCodes} from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import shareCalendarWithServiceAccount from "../utils/shareCalendarWithServiceAccount";
import httpRequest from "../utils/httpRequest";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../navigation/AppNavigator";
import * as SecureStore from 'expo-secure-store';
import Toast from "react-native-toast-message";

interface Calendar {
    id: string;
    summary: string;
}

type SuccessScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'MainTabs'
>;


export default function SuccessScreen() {
    const [showModal, setShowModal] = useState(false)
    const navigation:SuccessScreenNavigationProp =  useNavigation();

    useEffect(()=> {
        GoogleSignin.configure({
            webClientId: Constants.manifest.extra.googleWebClientId,
            scopes: [
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/calendar.events',
            ],
            offlineAccess: true,
            forceCodeForRefreshToken: false,
        });
    },[]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingCalendars, setIsFetchingCalendars] = useState(false);

    const handleGoogleSignIn = async () => {
        try {
            const isSignedIn = GoogleSignin.hasPreviousSignIn();
            if (!isSignedIn) {
                await GoogleSignin.signIn();
            }
            console.log("aaaaaaaaaaaaaaaaaaaaaaa");
            const { accessToken } = await GoogleSignin.getTokens();
            console.log(accessToken);
            const userInfo = GoogleSignin.getCurrentUser();
            await SecureStore.setItemAsync('googleCalendarAccessToken', String(accessToken) ?? '');
            return accessToken;
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                Toast.show({
                    type: 'error',
                    text1: 'error!',
                    text2: 'Sign in cancelled.',
                });
                //Alert.alert('Sign in cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                Toast.show({
                    type: 'error',
                    text1: 'error!',
                    text2: 'Sign in already in progress.',
                });
                //Alert.alert('Sign in already in progress');
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'error!',
                    text2: 'Sign in error.',
                });
                // Alert.alert('Sign in error', error.toString());
            }
            throw error;
        }
    };

    const fetchCalendars = async (accessToken: string) => {
        try {
            setIsFetchingCalendars(true);
            const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/js on',
                },
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Failed to fetch calendars: ${response.status} - ${errorBody}`);
            }

            const data = await response.json();
            return data.items.filter((calendar: { accessRole: string }) => {
                return calendar.accessRole === "owner";
            });
        } catch (error) {
            throw new Error(`Error fetching calendars: ${error instanceof Error ? error.message : 'Unknown'}`);
        } finally {
            setIsFetchingCalendars(false);
        }
    };

    const handleShareCalendars = async () => {
        setIsLoading(true);
        try {
            const accessToken = await handleGoogleSignIn();
            const calendars = await fetchCalendars(accessToken);
            if (calendars.length === 0) {
                Alert.alert("You Don't have any calendars available in your google calendar");
                Toast.show({
                    type: 'error',
                    text1: 'error!',
                    text2: 'You Don\'t have any calendars available in your google calendar.',
                });
                return;
            }
            console.log(calendars)
            for (const calendar of calendars) {
                try {
                    const shared = await shareCalendarWithServiceAccount(accessToken, calendar.id);
                    const userId = await SecureStore.getItemAsync("userId");
                    if (!userId){
                        throw Error("User Isn't authetificated");
                    }
                    const response = await httpRequest('/app/calendar/', 'POST', {
                        google_calendar_id: calendar.id,
                        user_id: +userId,
                        summary: calendar.summary,
                    });

                    console.log(`Calendar ${calendar.id} shared and saved successfully:`, response);

                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainTabs' }],
                    });
                } catch (error) {
                    console.error(`Failed to process calendar ${calendar.id}:`, error);
                    Toast.show({
                        type: 'error',
                        text1: 'error!',
                        text2: 'Failed to share calendars.',
                    });
                }
            }

            Alert.alert('Success', 'Calendars shared and saved successfully!');
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to share calendars';
            // Alert.alert('Error', errorMessage);
            Toast.show({
                type: 'error',
                text1: 'error!',
                text2: 'Failed to share calendars.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.content}>
                {/* Success Icon */}
                <View style={styles.iconContainer}>
                    <View style={styles.iconBackground}>
                        <Calendar size={32} color="#fff" />
                        <View style={styles.checkmarkContainer}>
                            <Check size={16} color="#fff" />
                        </View>
                    </View>
                </View>

                {/* Success Message */}
                <Text style={styles.title}>Congratulation!</Text>
                <Text style={styles.subtitle}>Your account setup is complete! Enjoy our notification system.</Text>

                {/* Action Buttons */}
                <TouchableOpacity style={styles.getStartedButton} onPress={()=>{
                    // navigation.navigate("NotificationsScreen");
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainTabs' }],
                    });

                } }>
                    <Text style={styles.getStartedButtonText}>Get Started</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.linkButton} onPress={() => setShowModal(true)}>
                    <Text style={styles.linkButtonText}>Link my Google Calendar</Text>
                </TouchableOpacity>
            </View>

            {/* Google Calendar Modal */}
            <Modal animationType="slide" transparent={true} visible={showModal} onRequestClose={() => setShowModal(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowModal(false)}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHandle} />

                        <Text style={styles.modalTitle}>Link Google Calendar</Text>
                        <Text style={styles.modalSubtitle}>Connect to your gmail account that you want to use its calendar</Text>

                        <TouchableOpacity
                            style={styles.googleButton}
                            onPress={async () => {
                                await handleShareCalendars()
                                setShowModal(false)
                            }}
                        >
                            <Image source={{ uri: "https://www.google.com/favicon.ico" }} style={styles.googleIcon} />
                            <Text style={styles.googleButtonText}>Sign in with Google</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
            <Toast/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    iconContainer: {
        marginBottom: 24,
    },
    iconBackground: {
        width: 80,
        height: 80,
        backgroundColor: "#2E8B57",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    checkmarkContainer: {
        position: "absolute",
        right: -4,
        top: -4,
        backgroundColor: "#2E8B57",
        borderRadius: 12,
        padding: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 20,
        color: "#A6A6A6",
        textAlign: "center",
        marginBottom: 32,
        paddingHorizontal: 24,
    },
    getStartedButton: {
        backgroundColor: "#2E8B57",
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 100,
        width: "100%",
        marginBottom: 16,
    },
    getStartedButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    linkButton: {
        paddingVertical: 8,
    },
    linkButtonText: {
        color: "#2E8B57",
        fontSize: 16,
        fontWeight: "500",
        textDecorationLine: "underline",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 32,
        alignItems: "center",
        height: "35%",

    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: "#E0E0E0",
        borderRadius: 2,
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "left",
    },
    modalSubtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "left",
        marginBottom: 24,
    },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 60,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: "500",
    },
});