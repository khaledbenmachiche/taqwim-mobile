import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export type TabParamList = {
  Notifications: undefined;
  Profile: undefined;
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const CustomTabBar = ({ state, navigation }: any) => (
  <View style={styles.tabBarContainer}>
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const iconName = index === 0 ? 'notifications' : 'person';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={[styles.tab, isFocused && styles.activeTab]}
            onPress={onPress}
          >
            <Ionicons
              name={iconName}
              size={20}
              color={isFocused ? 'white' : '#1B7B5E'}
            />
            {isFocused && (
              <Text style={styles.tabText}>
                {index === 0 ? 'Notifications' : 'Profile'}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: '#1B7B5E',
  },
  tabText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TabNavigator;