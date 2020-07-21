import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  useReducer,
  useMemo,
  useRef,
} from 'react';

import {
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';

import {getwh, getww, width} from './app/utils/layout';

import AppIntroSlider from 'react-native-app-intro-slider';

import {callPostApi} from './app/services/index';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';

import register from './app/screens/register';

import mainscreen from './app/screens/mainscreen';

import addcoursescreen from './app/screens/addcoursescreen';

import DeviceInfo from 'react-native-device-info';

import {getUniqueId} from 'react-native-device-info';

import viewdetails from './app/screens/viewdetails';

import AsyncStorage from '@react-native-community/async-storage';

import postattendance from './app/screens/postattendance';

import postattendancev from './app/screens/postattendancev';

import verficationscreen from './app/screens/verficationscreen';

import {useColorScheme} from 'react-native-appearance';

import detailedattendanceview from './app/screens/detailedattendanceview';

const AuthContext = createContext();

function SplashScreen() {
  return (
    <View style={styles.splash}>
      <Image
        style={loginstyles.imageSplash}
        source={require('./app/assets/dasicon.png')}
      />
    </View>
  );
}

function login() {
  const {signIn} = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const [logintext, setLoginText] = useState('');
  const [registertext, setRegisterText] = useState('');
  const [logininfo, setLoginInfo] = useState(false);

  const onSucess = async () => {
    setLoginInfo(true);
    var info = await signIn({logintext, registertext});
    setLoginInfo(info);
  };
  return (
    <View>
      <Image
        style={loginstyles.image}
        source={require('./app/assets/dasicon.png')}
      />
      <TextInput
        style={
          colorScheme === 'dark'
            ? loginstyles.darkusernameinput
            : loginstyles.usernameinput
        }
        placeholder="Username"
        placeholderTextColor={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
        onChangeText={text => setLoginText(text)}
        defaultValue={logintext}
      />
      <TextInput
        style={
          colorScheme === 'dark'
            ? loginstyles.darkpasswordinput
            : loginstyles.passwordinput
        }
        secureTextEntry={true}
        placeholder="Password"
        placeholderTextColor={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
        onChangeText={text => setRegisterText(text)}
        defaultValue={registertext}
      />
      <TouchableOpacity
        style={loginstyles.loginbutton}
        onPress={() => onSucess()}>
        <Text style={loginstyles.logintext}>
          {logininfo ? 'Logging In...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
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
  const slides = [
    {
      key: 1,
      title: 'D.A.S',
      text: 'Welcome to DAS',
      desc: 'Firstly, Login using you college credentials',
      login: false,
      image: require('./app/assets/attendance.png'),
    },
    {
      key: 2,
      title: 'D.A.S',
      text: 'Step 2',
      desc: 'Select the course',
      login: false,
      image: require('./app/assets/ff4e830ad7e7604c98f5756c05cd6b14.png'),
    },
    {
      key: 3,
      title: 'D.A.S',
      text: 'Step 3 ',
      desc: 'Scan the QR code displayed',
      login: true,
      image: require('./app/assets/78107-200.png'),
    },
  ];
  const _renderItem = ({item}) => {
    return (
      <View style={item.login ? styles.slide1 : styles.slide}>
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
const Stack = createStackNavigator();

export default function App({navigation}) {
  const colorScheme = useColorScheme();
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('token');
      } catch (e) {}
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        var username = data.logintext.toLowerCase();
        var urldata = {
          username: username,
          password: data.registertext,
        };
        var url = 'token/login';
        var loginApi = await callPostApi(urldata, url);
        await AsyncStorage.setItem('token', loginApi.token);
        await AsyncStorage.setItem('username', username);
        if (loginApi.token !== undefined) {
          dispatch({type: 'SIGN_IN', token: loginApi.token});
        }
        return false;
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer
        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator headerMode={'none'}>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            <>
              <Stack.Screen
                name="Walkthrough"
                component={walkthrough}
                options={{
                  // When logging out, a pop animation feels intuitive
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}
              />
              <Stack.Screen name="Login" component={login} />
              <Stack.Screen name="Register" component={register} />
              <Stack.Screen name="Verification" component={verficationscreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={mainscreen} />
              <Stack.Screen name="ViewDetails" component={viewdetails} />
              <Stack.Screen name="PostAttendance" component={postattendance} />
              <Stack.Screen
                name="PostAttendanceV"
                component={postattendancev}
              />
              <Stack.Screen
                name="DetailedAttendance"
                component={detailedattendanceview}
              />
              <Stack.Screen name="AddCourse" component={addcoursescreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getwh(30),
  },
  splash: {
    flex: 1,
    justifyContent: 'center',
  },
  slide1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getwh(15),
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
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  loginbutton: {
    backgroundColor: '#007aff',
    width: getww(60),
    height: getwh(6),
    marginTop: getwh(2),
    marginLeft: getww(15),
    marginRight: getww(15),
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    borderColor: '#007aff',
  },
  logintext: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registertext: {
    color: '#007aff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerbutton: {
    backgroundColor: '#FFFFFF',
    width: getww(60),
    height: getwh(6),
    marginTop: getwh(2),
    marginLeft: getww(15),
    marginRight: getww(15),
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#007aff',
    justifyContent: 'center',
  },
  darkregisterbutton: {
    backgroundColor: '#000000',
    width: getww(60),
    height: getwh(6),
    marginTop: getwh(2),
    marginLeft: getww(15),
    marginRight: getww(15),
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#007aff',
    justifyContent: 'center',
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
const loginstyles = StyleSheet.create({
  loginbutton: {
    backgroundColor: '#007aff',
    width: getww(60),
    height: getwh(6),
    marginTop: getwh(4),
    marginLeft: getww(19.5),
    marginRight: getww(15),
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#007aff',
    justifyContent: 'center',
  },
  logintext: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  usernameinput: {
    borderWidth: 2,
    paddingLeft: getww(4),
    fontSize: 15,
    marginTop: getwh(1),
    marginLeft: getww(15),
    borderRadius: 40,
    borderColor: '#007aff',
    marginRight: getww(15),
    alignItems: 'center',
    color: '#000000',
  },
  darkusernameinput: {
    borderWidth: 2,
    paddingLeft: getww(4),
    fontSize: 15,
    marginTop: getwh(1),
    marginLeft: getww(15),
    borderRadius: 40,
    borderColor: '#007aff',
    marginRight: getww(15),
    alignItems: 'center',
    color: '#FFFFFF',
  },
  passwordinput: {
    borderWidth: 2,
    paddingLeft: getww(4),
    fontSize: 15,
    marginTop: getwh(5),
    marginLeft: getww(15),
    borderRadius: 40,
    borderColor: '#007aff',
    marginRight: getww(15),
    alignItems: 'center',
    color: '#000000',
  },
  darkpasswordinput: {
    borderWidth: 2,
    paddingLeft: getww(4),
    fontSize: 15,
    marginTop: getwh(5),
    marginLeft: getww(15),
    borderRadius: 40,
    borderColor: '#007aff',
    marginRight: getww(15),
    alignItems: 'center',
    color: '#FFFFFF',
  },
  image: {
    marginLeft: getww(38),
    width: getww(25),
    height: getwh(25),
    marginTop: getwh(13),
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  imageSplash: {
    marginLeft: getww(38),
    width: getww(30),
    height: getwh(30),
    resizeMode: 'contain',
  },
});
