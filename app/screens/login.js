import React, {useState} from 'react';

import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import {getwh, getww} from '../utils/layout';

import {callPostApi} from '../services/index';

import {useColorScheme} from 'react-native-appearance';

function login({navigation}) {
  const colorScheme = useColorScheme();
  const [logintext, setLoginText] = useState('');
  const [registertext, setRegisterText] = useState('');

  const onSucess = async () => {
    var data = {
      username: logintext,
      password: registertext,
    };
    var url = 'token/login';
    var loginApi = await callPostApi(data, url);
    AsyncStorage.setItem('token', loginApi.token);
    AsyncStorage.setItem('username', logintext);
    if (loginApi.token !== undefined) {
      navigation.push('Home');
    }
  };
  return (
    <View>
      <Image style={styles.image} source={require('../assets/dasicon.png')} />
      <TextInput
        style={
          colorScheme === 'dark'
            ? styles.darkusernameinput
            : styles.usernameinput
        }
        placeholder="Username"
        placeholderTextColor={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
        onChangeText={text => setLoginText(text)}
        defaultValue={logintext}
      />
      <TextInput
        style={
          colorScheme === 'dark'
            ? styles.darkpasswordinput
            : styles.passwordinput
        }
        secureTextEntry={true}
        placeholder="Password"
        placeholderTextColor={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
        onChangeText={text => setRegisterText(text)}
        defaultValue={registertext}
      />
      <TouchableOpacity style={styles.loginbutton} onPress={() => onSucess()}>
        <Text style={styles.logintext}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  loginbutton: {
    backgroundColor: '#007aff',
    padding: getww(2),
    width: getww(60),
    height: getwh(6),
    marginTop: getwh(4),
    paddingTop: getwh(1.5),
    paddingBottom: getwh(2),
    marginLeft: getww(19.5),
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
});
export default login;
