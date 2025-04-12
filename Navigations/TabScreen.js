import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; 

import DashboardScreen from '../Screens/DashboardScreen';
import BtconfigScreen from '../Screens/BtconfigScreen';
import KeyScreen from '../Screens/KeyScreen';
import SettingsScreen from '../Screens/SettingsScreen';

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
            tabBarIcon: ({color, size }) => 
              (
              <Icon name="bluetooth" size={size} color={color} />
            ),
          }}
        />
          
          <Tab.Screen 
          name="Device Configuration" 
          component={KeyScreen} 
          options={{
            tabBarIcon: ({ color, size }) => 
              (
              <Icon name= "keypad" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen 
          name="User Settings" 
          component={SettingsScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name= "settings-sharp" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
  );
}
