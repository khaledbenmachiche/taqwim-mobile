import React, { useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

interface NotificationOverlayProps {
    title?: string;
    body?: string;
    onHide: () => void;
}

export const NotificationOverlay = ({ title, body, onHide }: NotificationOverlayProps) => {
    const slideAnim = new Animated.Value(-100);

    useEffect(() => {
        // Slide in animation
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Auto-hide after 5 seconds
        const timer = setTimeout(() => {
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }).start(() => onHide());
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Animated.View
            style={[
                styles.container,
                { transform: [{ translateY: slideAnim }] }
            ]}
        >
            <View style={styles.content}>
                {title && <Text style={styles.title}>{title}</Text>}
                {body && <Text style={styles.body}>{body}</Text>}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 40, // Adjust this value based on status bar height
        left: 10,
        right: 10,
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 9999,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    body: {
        fontSize: 14,
        color: '#666',
    },
});