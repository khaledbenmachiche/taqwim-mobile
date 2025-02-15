import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
    SafeAreaView,
    NativeSyntheticEvent,
    NativeScrollEvent
} from 'react-native';

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

// @ts-ignore
import Image1 from '../../assets/images/a-whole-year-cuate.png';
// @ts-ignore
import Image2 from '../../assets/images/date-picker-cuate.png';
// @ts-ignore
import Image3 from '../../assets/images/events-cuate.png';

const { width } = Dimensions.get('window');

interface Slide {
    id: string;
    title: string;
    subtitle: string;
    image: any;
}

const slides: Slide[] = [
    {
        id: '1',
        title: "Let's Sync!",
        subtitle: 'Ready to organize your time like a pro?',
        image: Image1,
    },
    {
        id: '2',
        title: 'Welcome to\ntaqwim',
        subtitle: 'Sync your Google Calendar, get SMS reminders, and manage events effortlessly.',
        image: Image2,
    },
    {
        id: '3',
        title: 'Smart Alerts, Anytime',
        subtitle: 'Even without internet? No problem! We send SMS reminders for your events automatically',
        image: Image3,
    },
];

type OnBoardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login' | 'SignUp'>;

export default function OnBoardingScreen() {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const flatListRef = useRef<FlatList | null>(null);
    const navigation = useNavigation<OnBoardingScreenNavigationProp>();

    const renderItem = ({ item }: { item: Slide }) => (
        <View style={styles.slide}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
    );

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset } = event.nativeEvent;
        const index = Math.round(contentOffset.x / width);
        setCurrentIndex(index);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate("Login")}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <View style={styles.slidesContainer}>
                <FlatList
                    ref={flatListRef}
                    data={slides}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                />
            </View>

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                index === currentIndex && styles.paginationDotActive,
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.signInButtonText}>Sign in</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.createAccountButton} onPress={() => navigation.navigate("SignUp")}>
                    <Text style={styles.createAccountText}>Create an account</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    skipButton: {
        alignSelf: 'flex-start',
        padding: 20,
    },
    skipText: {
        color: '#20845A',
        fontSize: 16,
    },
    slidesContainer: {
        flex: 1,
    },
    slide: {
        width,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    image: {
        width: width * 0.8,
        height: width * 0.8,
        marginVertical: 30,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#000',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        paddingHorizontal: 20,
    },
    footer: {
        padding: 20,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#20845A',
    },
    signInButton: {
        backgroundColor: '#20845A',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 10,
    },
    signInButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    createAccountButton: {
        paddingVertical: 16,
    },
    createAccountText: {
        color: '#20845A',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});