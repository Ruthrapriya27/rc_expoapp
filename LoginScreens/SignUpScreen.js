import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSendOTP = () => {
    setIsModalVisible(true);
  };

  const handleOptionSelect = (method) => {
    setIsModalVisible(false);
    console.log(`Send OTP via ${method}`);
  
    if (method === 'Email') {
      navigation.navigate('OtpVerification', {
        method: 'Email',
        email: email,
      });
    } else if (method === 'Mobile') {
      navigation.navigate('OtpVerification', {
        method: 'Mobile',
        mobile: mobile,
      });
    }
  };
  

  const handleGmailSignup = () => {
    console.log('Redirecting to Gmail');
    // navigation.navigate('Dashboard'); // Simulate successful login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign up Here!</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Mobile number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.otpButton} onPress={handleSendOTP}>
        <Text style={styles.otpButtonText}>Send OTP</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity style={styles.gmailButton} onPress={handleGmailSignup}>
      <Icon name="gmail" style={styles.icon} />
      <Text style={styles.gmailButtonText}>Sign up using Gmail  </Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Choose OTP Method</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleOptionSelect('Email')}
            >
              <View style={styles.circle} />
              <Text style={styles.optionText}>Via Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleOptionSelect('Mobile')}
            >
              <View style={styles.circle} />
              <Text style={styles.optionText}>Via Mobile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E99F', // Light yellow 
    padding: 20,
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF6D60',
    alignSelf: 'center',
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20, 
    borderRadius: 15,  
    marginBottom: 20,  
    shadowColor: '#000',  
    shadowOffset: { width: 0, height: 5 }, 
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, 
    borderColor: '#F7D060', 
    borderWidth: 1, 
  },
  label: {
    fontSize: 16,
    color: '#FF6D60',
    marginBottom: 5, 
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#F7D060',
    borderRadius: 10, 
    marginBottom: 10,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9', // Light background for inputs
  },
  otpButton: {
    backgroundColor: '#FF6D60',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  otpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#FF6D60',
    marginVertical: 25,
  },
  gmailButton: {
    backgroundColor: '#98D8AA',
    borderLeftColor: '#F7D060', 
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30, 
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, 
  },
  
  gmailButtonText: {
    color: '#FFFFFF', 
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12, 
  },
  icon: {
    color: '#FFFFFF', 
    fontSize: 24, 
    marginRight: 10, 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    borderColor: '#F7D060',
    borderWidth: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6D60',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  circle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#F7D060',
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
  }
});

export default SignUpScreen;

