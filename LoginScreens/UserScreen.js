import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const UserScreen = ({ navigation }) =>
  {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <View style={styles.container}>   

     {/* Logo */}
     <View style={styles.logoContainer}>
        {/*<Image
           source={require('../../assets/images/innospace_logo.png')} 
          style={styles.logo}
        />*/}
        <Text style={styles.startLine}>Welcome to Innospace</Text>
      </View>

      {/*1.Email*/} 

      <View style={styles.BoxAboveHeader}>
        <Text style={styles.label}>Enter your email</Text>
      </View>

      <TextInput
        style={styles.inputBox}
        placeholder= " @gmail.com"
        placeholderTextColor="grey"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      {/*2.Password*/}

      <View style={styles.BoxAboveHeader}>
        <Text style={styles.label}>Enter your password</Text>
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.inputBox}
        placeholder=""
        placeholderTextColor="grey"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {/*3.Login*/}

      <TouchableOpacity style={styles.loginButton}

      onPress={() => navigation.navigate('TabScreen')}
      >
       <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      
      {/*4.Signup*/}

      <View style={styles.signupContainer}>
        <Text style={styles.signupLabel}>Don't have an account? </Text>
        <TouchableOpacity>
          <Text style={styles.signupLink}>Sign up here</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create
({
  container: 
  {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },

  startLine: 
  {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10,
    marginBottom:30,
    textAlign: 'center'
  },

  BoxAboveHeader: 
  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  label: 
  {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
    fontWeight: '400',
  },

  inputBox: 
  {
    height: 50,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
 
  forgotPassword: 
  {
    color: '#000',
    fontSize: 14,
    textDecorationLine: 'underline'
  },

  loginButton: 
  {
    backgroundColor: '#000',
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },

  loginButtonText: 
  {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  signupContainer: 
  {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  signupLink: 
  {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  }
});

export default UserScreen;