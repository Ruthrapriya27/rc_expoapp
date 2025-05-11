import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Image,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { height, width } = Dimensions.get('window');

const WaveBackground = () => (
  <Svg
    height={60}
    width={width}
    style={styles.wave}
    viewBox={`0 0 ${width} 60`}
    preserveAspectRatio="none"
  >
    <Path
      fill="#B7E0FF"
      d={`M0,20 C${width / 3},0 ${width / 1.5},40 ${width},20 L${width},60 L0,60 Z`}
    />
  </Svg>
);

const WelcomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    {/* Top image section - using a fallback color if image fails */}
    <View style={styles.imageContainer}>
      <ImageBackground
        source={require('./../assets/images/innospace logo2.webp')}
        style={styles.topImage}
        imageStyle={styles.topImageStyle}
      >
        <View style={styles.overlay} />
      </ImageBackground>
    </View>

    {/* Wave transition */}
    <WaveBackground />

    {/* Bottom content panel */}
    <View style={styles.bottomPanel}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Innospace</Text>
        <Text style={styles.subtitle}>
          Discover new ways to connect, configure, and control effortlessly
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started →</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  imageContainer: {
    height: height * 0.4,
    backgroundColor: '#E1F0FF', // Fallback color
  },
  topImage: {
    flex: 1,
    // borderBottomLeftRadius: 40,
    // borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  wave: {
    position: 'absolute',
    top: height * 0.4 - 30,
    width: '100%',
  },
  bottomPanel: {
    flex: 1,
    backgroundColor: '#B7E0FF',
    paddingTop: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A3E72',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4A6FA5',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#FFA62F',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default WelcomeScreen;