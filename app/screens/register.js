import React, {useState} from 'react';

import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  Alert,
} from 'react-native';

import {getwh, getww} from '../utils/layout';

import {callPostApi} from '../services/index';

import {useColorScheme} from 'react-native-appearance';

function register({navigation}) {
  const [nametext, setNameText] = useState('');
  const [emailtext, setEmailText] = useState('');
  const [regnotext, setRegNoText] = useState('');
  const [passwordtext, setPasswordText] = useState('');
  const [confirmpasswordtext, setConfirmPasswordText] = useState('');
  const [emailvalid, setEmailValid] = useState('');
  const [usernamevalid, setUsernameValid] = useState('');
  const [passwordvalid, setPasswordValid] = useState('');
  const [emailtouch, setEmailTouch] = useState(false);
  const [passwordtouch, setPasswordTouch] = useState(false);
  const [registerinfo, setRegisterInfo] = useState(false);
  const colorScheme = useColorScheme();

  const emailvalidation = text => {
    var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === true) {
      setEmailValid(true);
      setEmailText(text);
    } else {
      setEmailValid(false);
    }
  };

  const usernamevalidation = text => {
    var reg = /[&\/\\#,+()$~%.'":*?<>{}]/g;
    if (reg.test(text) === true) {
      setUsernameValid(false);
    } else {
      setUsernameValid(true);
      setRegNoText(text.replace(/ /g, ''));
    }
  };

  const passwordvalidation = text => {
    if (passwordtext === text) {
      if (text.length !== 0) {
        setPasswordValid(true);
        setConfirmPasswordText(text);
      }
    } else {
      setPasswordValid(false);
    }
  };
  const onSucess = async () => {
    setRegisterInfo(true);
    var regno = regnotext.toLowerCase();
    var emailid = emailtext.toLowerCase();
    var data = {
      username: regno,
      name: nametext,
      email: emailid,
      password: confirmpasswordtext,
      cat: 'student',
    };
    var url = 'register';
    var registerApi = await callPostApi(data, url);
    try {
      if (registerApi.Registration === 'Successful, verification email sent.') {
        navigation.push('Verification');
      } else if (registerApi.Registration === 'not-successful,user exists') {
        Alert.alert(
          'Error',
          'User Already Exists',
          [
            {
              text: 'Try Again',
            },
          ],
          {cancelable: false},
        );
      } else {
        Alert.alert(
          'Error',
          'Something went wrong',
          [
            {
              text: 'Try Again',
            },
          ],
          {cancelable: false},
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Cannot get response from server',
        [
          {
            text: 'Try Again',
          },
        ],
        {cancelable: false},
      );
    }
    setRegisterInfo(false);
  };
  return (
    <ScrollView style={styles.registerview}>
      <Text style={styles.title}>Welcome to D.A.S</Text>
      <Text style={styles.titleA}>
        Please fill in the following information to register into D.A.S
      </Text>
      <TextInput
        style={colorScheme === 'dark' ? styles.darknameinput : styles.nameinput}
        placeholder="Name"
        placeholderTextColor={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
        onChangeText={text => setNameText(text)}
        defaultValue={nametext}
      />
      <View style={styles.emailview}>
        <TextInput
          style={
            colorScheme === 'dark' ? styles.darkemailinput : styles.emailinput
          }
          placeholder="Email"
          placeholderTextColor={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
          onKeyPress={() => setEmailTouch(true)}
          onChangeText={text => emailvalidation(text.replace(/ /g, ''))}
          defaultValue={emailtext.replace(/ /g, '')}
        />
        {emailtouch ? (
          emailvalid ? (
            <Image
              style={styles.validimage}
              source={require('../assets/greentick.png')}
            />
          ) : (
            <Image
              style={styles.invalidimage}
              source={require('../assets/redtick.png')}
            />
          )
        ) : null}
      </View>
      <TextInput
        style={
          colorScheme === 'dark' ? styles.darkregnoinput : styles.regnoinput
        }
        placeholder="Registration No"
        placeholderTextColor={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
        onChangeText={text => usernamevalidation(text)}
        defaultValue={regnotext}
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
        onChangeText={text => setPasswordText(text)}
        defaultValue={passwordtext}
      />
      <View style={styles.emailview}>
        <TextInput
          style={
            colorScheme === 'dark'
              ? styles.darkconfirmpasswordinput
              : styles.confirmpasswordinput
          }
          secureTextEntry={true}
          onKeyPress={() => setPasswordTouch(true)}
          placeholder="Confirm Password"
          placeholderTextColor={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
          onChangeText={text => passwordvalidation(text)}
          defaultValue={confirmpasswordtext}
        />
        {passwordtouch ? (
          passwordvalid ? (
            <Image
              style={styles.validimage}
              source={require('../assets/greentick.png')}
            />
          ) : (
            <Image
              style={styles.invalidimage}
              source={require('../assets/redtick.png')}
            />
          )
        ) : null}
      </View>
      <TouchableOpacity
        style={styles.registerbutton}
        disabled={registerinfo}
        onPress={() => {
          if (
            nametext &&
            emailtext &&
            passwordtext &&
            confirmpasswordtext &&
            regnotext !== ''
          ) {
            if (emailvalid && passwordvalid && usernamevalid === true) {
              onSucess();
            } else {
              Alert.alert(
                'Error',
                'Please Check your Email,Password and Reg No(No Special Characters Allowed)',
                [
                  {
                    text: 'Try Again',
                  },
                ],
                {cancelable: false},
              );
            }
          } else {
            Alert.alert(
              'Error',
              'All the fields have not been entered',
              [
                {
                  text: 'Try Again',
                },
              ],
              {cancelable: false},
            );
          }
        }}>
        <Text style={styles.registertext}>
          {registerinfo ? 'Registering...' : 'Register'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  registerbutton: {
    backgroundColor: '#007aff',
    width: getww(60),
    height: getwh(7),
    marginTop: getwh(4),
    marginLeft: getww(19.5),
    marginRight: getww(15),
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#007aff',
    justifyContent: 'center',
  },
  title: {
    marginTop: getwh(7),
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#007aff',
  },
  titleA: {
    textAlign: 'center',
    marginTop: getwh(2),
    fontSize: 18,
    marginLeft: getww(10),
    marginRight: getww(10),
    color: '#007aff',
  },
  emailview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    borderColor: '#007aff',
    marginLeft: getww(15),
    marginRight: getww(15),
  },
  registertext: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerview: {
    marginBottom: getwh(2),
  },
  nameinput: {
    borderBottomWidth: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    paddingLeft: getww(2.5),
    fontSize: 15,
    marginTop: getwh(5),
    marginLeft: getww(15),
    borderRadius: 40,
    borderColor: '#007aff',
    marginRight: getww(15),
    alignItems: 'center',
    color: '#000000',
  },
  darknameinput: {
    borderBottomWidth: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    paddingLeft: getww(2.5),
    fontSize: 15,
    marginTop: getwh(5),
    marginLeft: getww(15),
    borderRadius: 40,
    borderColor: '#007aff',
    marginRight: getww(15),
    alignItems: 'center',
    color: '#FFFFFF',
  },
  emailinput: {
    width: getww(47),
    paddingLeft: getww(0),
    fontSize: 15,
    marginTop: getwh(5),
    marginLeft: getww(2.5),
    borderRadius: 40,
    borderColor: '#007aff',
    marginRight: getww(15),
    alignItems: 'center',
    color: '#000000',
  },
  darkemailinput: {
    width: getww(47),
    paddingLeft: getww(0),
    fontSize: 15,
    marginTop: getwh(5),
    marginLeft: getww(2.5),
    borderRadius: 40,
    borderColor: '#007aff',
    marginRight: getww(15),
    alignItems: 'center',
    color: '#FFFFFF',
  },
  regnoinput: {
    borderBottomWidth: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    paddingLeft: getww(2.5),
    fontSize: 15,
    marginTop: getwh(5),
    marginLeft: getww(15),
    borderRadius: 40,
    borderColor: '#007aff',
    marginRight: getww(15),
    alignItems: 'center',
    color: '#000000',
  },
  darkregnoinput: {
    borderBottomWidth: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    paddingLeft: getww(2.5),
    fontSize: 15,
    marginTop: getwh(5),
    marginLeft: getww(15),
    borderRadius: 40,
    borderColor: '#007aff',
    marginRight: getww(15),
    alignItems: 'center',
    color: '#FFFFFF',
  },
  passwordinput: {
    borderBottomWidth: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    paddingLeft: getww(2.5),
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
    borderBottomWidth: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    paddingLeft: getww(2.5),
    fontSize: 15,
    marginTop: getwh(5),
    marginLeft: getww(15),
    borderRadius: 40,
    borderColor: '#007aff',
    marginRight: getww(15),
    alignItems: 'center',
    color: '#FFFFFF',
  },
  confirmpasswordinput: {
    width: getww(47),
    paddingLeft: getww(0),
    fontSize: 15,
    marginTop: getwh(5),
    marginLeft: getww(2.5),
    borderRadius: 40,
    borderColor: '#007aff',
    marginRight: getww(15),
    alignItems: 'center',
    color: '#000000',
  },
  darkconfirmpasswordinput: {
    width: getww(47),
    paddingLeft: getww(0),
    fontSize: 15,
    marginTop: getwh(5),
    marginLeft: getww(2.5),
    borderRadius: 40,
    borderColor: '#007aff',
    marginRight: getww(15),
    alignItems: 'center',
    color: '#FFFFFF',
  },
  validimage: {
    marginTop: getwh(5.5),
    width: getww(5),
    height: getwh(5),
    resizeMode: 'contain',
    alignItems: 'center',
  },
  invalidimage: {
    marginTop: getwh(5.5),
    width: getww(5.5),
    height: getwh(5.5),
    resizeMode: 'contain',
    alignItems: 'center',
  },
});
export default register;
