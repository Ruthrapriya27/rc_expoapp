import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';

const { height, width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    {/* Top wave image section */}
    <ImageBackground
      // source={require('./../assets/images/innospace logo2.webp')}
      style={styles.topWave}
      resizeMode="cover"
    >
      {/* You can optionally place a logo or title here */}
    </ImageBackground>

    {/* Bottom white panel */}
    <View style={styles.bottomPanel}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>
        Discover new ways to connect, configure, and control effortlessly
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Get Started →</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  topWave: {
    height: height * 0.55,
    width: width,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    overflow: 'hidden',
  },
  bottomPanel: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: -60,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#5F6368',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#FFA000',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default WelcomeScreen;
