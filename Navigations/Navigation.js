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
import ConfigSumScreen from '../Screens/ConfigSumScreen.js';
import WelcomeScreen from '../Screens/WelcomeScreen.js'

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
          name="Welcome Screen"
          component={WelcomeScreen}
          options={{ title: 'Welcome to Innospace',headerShown: false}}
        /> 

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login/Signup',headerShown: false}}
        />
         
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ title: 'New User Registration',headerShown: false}}
        />
         
         <Stack.Screen
          name="OtpVerification"
          component={OtpScreen}
          options={{ title: 'OTP',headerShown: false}}
        />
         
         <Stack.Screen
          name="Forgot Password"
          component={ForgotPasswordScreen}
          options={{ title: 'Reset Password',headerShown: false}}
        />

        <Stack.Screen
          name="User Registration"
          component={NewUserRegistrationScreen}
          options={{ title: 'Create Account',headerShown: false}}
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

        <Stack.Screen 
          name="Config Summary" 
          component={ConfigSumScreen} 
          options={{ title: 'Configuration Summary' }}
        />
 
      </Stack.Navigator>
    </NavigationContainer>
  
  );
};

export default App;
