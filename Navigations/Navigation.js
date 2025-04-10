import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import UserScreen from '../LoginScreens/UserScreen';
import TabScreen from './TabScreen'
import DashboardScreen from '../Screens/DashboardScreen';

const Stack = createStackNavigator();

const App = () => 
  {
  return (
    <NavigationContainer>
      <Stack.Navigator

        screenOptions = 
        {{
          headerTitleAlign: 'center' 
        }}
      >
        <Stack.Screen
          name="Users"
          component={UserScreen}
          options={{ title: 'Login/Signup',headerShown: false}}
        />

        <Stack.Screen
          name="TabScreen"
          component={TabScreen}
          options={{ title: 'TabScreen',headerShown: false }}
        />   
       
       <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Dashboard' }}
        />
 
      </Stack.Navigator>
    </NavigationContainer>
  
  );
};

export default App;
