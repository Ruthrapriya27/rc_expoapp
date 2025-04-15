import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../LoginScreens/LoginScreen.js';
import TabScreen from './TabScreen'
import DashboardScreen from '../Screens/DashboardScreen';
import SignUpScreen from '../LoginScreens/SignUpScreen.js';
import OtpScreen from '../LoginScreens/OtpScreen';
import NewUserRegistrationScreen from '../LoginScreens/NewUserRegistrationScreen';
import ForgotPasswordScreen from '../LoginScreens/ForgetPasswordScreen.js';

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
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login/Signup',headerShown: false}}
        />
         
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ title: 'New User Registration',headerShown: true}}
        />
         
         <Stack.Screen
          name="OtpVerification"
          component={OtpScreen}
          options={{ title: 'OTP',headerShown: true}}
        />
         
         <Stack.Screen
          name="Forgot Password"
          component={ForgotPasswordScreen}
          options={{ title: 'Rest Password',headerShown: true}}
        />

        <Stack.Screen
          name="User Registration"
          component={NewUserRegistrationScreen}
          options={{ title: 'Create Account',headerShown: true}}
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
