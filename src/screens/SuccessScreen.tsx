import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Modal, Image } from "react-native";
import { Calendar, Check } from "lucide-react-native";

export default function SuccessScreen() {
    const [showModal, setShowModal] = useState(false)

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
                <Text style={styles.subtitle}>your account is complete, please enjoy the notification system from us.</Text>

                {/* Action Buttons */}
                <TouchableOpacity style={styles.getStartedButton}>
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
                            onPress={() => {
                                // Handle Google Sign In
                                setShowModal(false)
                            }}
                        >
                            <Image source={{ uri: "https://www.google.com/favicon.ico" }} style={styles.googleIcon} />
                            <Text style={styles.googleButtonText}>Sign in with Google</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
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