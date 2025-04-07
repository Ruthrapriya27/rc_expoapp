import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import UserScreen from '../LoginScreens/UserScreen';
import TabScreen from './TabScreen'

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
          options={{ title: 'Login/Signup'}}
        />

        <Stack.Screen
          name="TabScreen"
          component={TabScreen}
          options={{ title: 'TabScreen',headerShown: false }}
        />   
      </Stack.Navigator>
    </NavigationContainer>
  
  );
};

export default App;
