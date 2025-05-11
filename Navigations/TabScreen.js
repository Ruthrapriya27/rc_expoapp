import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import DashboardScreen from '../Screens/DashboardScreen';
import BtconfigScreen from '../Screens/BtconfigScreen';
import KeyScreen from '../Screens/KeyScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarInactiveTintColor: 'grey',
        tabBarActiveTintColor: 'black',
      }}
    >

      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Bluetooth"
        component={BtconfigScreen}
        options={{
          tabBarIcon: ({ color, size }) =>
          (
            <Icon name="bluetooth" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Device Configuration"
        component={KeyScreen}
        options={({ navigation }) => ({
          title: 'Device Configuration',
          tabBarIcon: ({ color, size }) => (
            <Icon name="keypad" size={size} color={color} />
          ),
          headerRight: () => (
            <MaterialIcons
              name="summarize"
              size={28}
              color="#1A73E8" // your primary color
              style={{ marginRight: 16 }}
              onPress={() => navigation.navigate('Config Summary')}
            />
          ),
        })}
      />


      <Tab.Screen
        name="User Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings-sharp" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
