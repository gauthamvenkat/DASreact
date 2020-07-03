import React, {useRef} from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';

import AppIntroSlider from 'react-native-app-intro-slider';

import {getwh, getww} from '../utils/layout';

import {useColorScheme} from 'react-native-appearance';

function walkthrough({navigation}) {
  const colorScheme = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const _renderItem = ({item}) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        <Image style={styles.image} source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.text}>{item.desc}</Text>
        {item.login === true ? (
          <Animated.View
            style={[
              {
                opacity: fadeAnim, // Bind opacity to animated value
              },
            ]}>
            <TouchableOpacity
              style={styles.loginbutton}
              onPress={() => navigation.push('Login')}>
              <Text style={styles.logintext}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                colorScheme === 'dark'
                  ? styles.darkregisterbutton
                  : styles.registerbutton
              }
              onPress={() => navigation.push('Register')}>
              <Text style={styles.registertext}>Register</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : null}
      </View>
    );
  };
  return (
    <AppIntroSlider
      showNextButton={false}
      showDoneButton={false}
      onDone={fadeIn()}
      renderItem={_renderItem}
      activeDotStyle={styles.activeslider}
      dotStyle={styles.slider}
      data={slides}
      keyExtractor={item => item.key.toString()}
    />
  );
}
const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    color: '#007aff',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: getwh(21),
  },
  slider: {
    backgroundColor: '#ADD8E6',
  },
  activeslider: {
    backgroundColor: '#007aff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007aff',
  },
  loginbutton: {
    backgroundColor: '#007aff',
    padding: getww(2),
    width: getww(60),
    height: getwh(6),
    marginTop: getwh(2),
    paddingTop: getwh(1.5),
    paddingBottom: getwh(2),
    marginLeft: getww(15),
    marginRight: getww(15),
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#007aff',
    alignItems: 'center',
  },
  logintext: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  registertext: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  registerbutton: {
    backgroundColor: '#FFFFFF',
    padding: getww(2),
    width: getww(60),
    height: getwh(6),
    marginTop: getwh(2),
    paddingTop: getwh(1.5),
    paddingBottom: getwh(2),
    marginLeft: getww(15),
    marginRight: getww(15),
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#007aff',
    alignItems: 'center',
  },
  darkregisterbutton: {
    backgroundColor: '#000000',
    padding: getww(2),
    width: getww(60),
    height: getwh(6),
    marginTop: getwh(2),
    paddingTop: getwh(1.5),
    paddingBottom: getwh(2),
    marginLeft: getww(15),
    marginRight: getww(15),
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#007aff',
    alignItems: 'center',
  },
  image: {
    width: getww(60),
    height: getwh(40),
    marginTop: getwh(0),
    justifyContent: 'center',
    resizeMode: 'contain',
    tintColor: '#007aff',
  },
});

const slides = [
  {
    key: 1,
    title: 'D.A.S',
    text: 'Welcome to DAS',
    desc: 'Firstly, Login using you college credentials',
    login: false,
    image: require('../assets/attendance.png'),
  },
  {
    key: 2,
    title: 'D.A.S',
    text: 'Step 2',
    desc: 'Select the course',
    login: false,
    image: require('../assets/ff4e830ad7e7604c98f5756c05cd6b14.png'),
  },
  {
    key: 3,
    title: 'D.A.S',
    text: 'Step 3 ',
    desc: 'Scan the QR code displayed',
    login: true,
    image: require('../assets/78107-200.png'),
  },
];
export default walkthrough;
