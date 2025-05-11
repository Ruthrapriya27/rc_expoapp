import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSendOTP = async () => {
    setEmailError('');
    setMobileError('');

    if (!email && !mobile) {
      setEmailError('Please enter an email address.');
      setMobileError('Please enter a mobile number.');
      return;
    }

    const validEmail = /^\S+@gmail\.com$/.test(email);
    const validMobile = /^\d{10}$/.test(mobile);

    if (!email) {
      setEmailError('Please enter an email address.');
      return;
    } else if (!validEmail) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    if (!mobile) {
      setMobileError('Please enter a mobile number.');
      return;
    } else if (!validMobile) {
      setMobileError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // const [localPart, domain] = email.split('@');

    // if (email !== 'admin@gmail.com' || mobile !== '1234567890') {
    //   if (email !== 'admin@gmail.com' && domain === 'gmail.com' && localPart !== 'admin') {
    //     setEmailError('User Email ID Doesn’t Exist.');
    //   }
    //   if (mobile !== '1234567890') {
    //     setMobileError('User Mobile Number Doesn’t Exist.');
    //   }
    //   return;
    // }

    try {
      await AsyncStorage.multiSet([
        ['@email', email],
        ['@mobileNumber', mobile],
      ]);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error saving data to AsyncStorage", error);
      showAlert("Failed to save data. Please try again.");
    }
  };

  const handleGmailSignup = () => {
    console.log('Redirecting to Gmail');
    // navigation.navigate('TabScreen');
  };

  const handleOptionSelect = (method) => {
    setIsModalVisible(false);
    console.log(`Send OTP via ${method}`);

    if (method === 'Email') {
      navigation.navigate('OtpVerification', {
        method: 'Email',
        email: email,  // Pass the email value
      });
    } else if (method === 'Mobile') {
      navigation.navigate('OtpVerification', {
        method: 'Mobile',
        mobile: mobile,  // Pass the mobile value
      });
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Sign up Here!</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (emailError) setEmailError('');
          }}
          keyboardType="email-address"
        />
        {emailError ? (
          <View style={styles.errorRow}>
            <Icon name="alert-circle-outline" size={16} color="red" />
            <Text style={styles.errorText}>{emailError}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Mobile number</Text>
        <TextInput
          style={[styles.input, mobileError ? styles.inputError : null]}
          placeholder="Enter your mobile number"
          value={mobile}
          onChangeText={(text) => {
            setMobile(text);
            if (mobileError) setMobileError('');
          }}
          keyboardType="numeric"
        />
        {mobileError ? (
          <View style={styles.errorRow}>
            <Icon name="alert-circle-outline" size={16} color="red" />
            <Text style={styles.errorText}>{mobileError}</Text>
          </View>
        ) : null}
      </View>

      <TouchableOpacity style={styles.otpButton} onPress={handleSendOTP}>
        <Text style={styles.otpButtonText}>Send OTP</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity style={styles.gmailButton} onPress={handleGmailSignup}>
        <Icon name="gmail" style={styles.icon} />
        <Text style={styles.gmailButtonText}>Sign up using Gmail</Text>
      </TouchableOpacity>


      <View style={styles.signupContainer}>
        <Text style={styles.signupLabel}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.LoginHereText}>Login Here</Text>
        </TouchableOpacity>
      </View>


      {/* OTP Method Modal */}
      <Modal visible={isModalVisible} transparent animationType="fade" onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Choose OTP Method</Text>

            <TouchableOpacity style={styles.modalOption} onPress={() => handleOptionSelect('Email')}>
              <View style={styles.circle} />
              <Text style={styles.optionText}>Via Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={() => handleOptionSelect('Mobile')}>
              <View style={styles.circle} />
              <Text style={styles.optionText}>Via Mobile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.alertModalButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.alertModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A73E8',
    alignSelf: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#1C1C1C',
    marginTop: 10,
    marginBottom: 5,
  },
  inputContainer: {
    width: '92%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 15,
    alignSelf: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  input: {
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputError: {
    borderColor: 'red',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  signupLabel: {
    marginTop: 20,
    color: '#000',
    fontSize: 14,
  },
  LoginHereText: {
    color: '#1A73E8',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
    marginTop: 20,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginLeft: 4,
  },
  otpButton: {
    backgroundColor: '#1A73E8',
    paddingVertical: 14,
    marginTop: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 30,
  },
  otpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 30,
    marginHorizontal: 40,
  },
  gmailButton: {
    flexDirection: 'row',
    backgroundColor: '#FFA000',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  gmailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  icon: {
    color: '#fff',
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    height: 220
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A73E8',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1A73E8',
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  alertModalButton: {
    borderTopWidth: 0.5,
    borderTopColor: '#DBDBDB',
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
  },
  alertModalButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default SignUpScreen;
