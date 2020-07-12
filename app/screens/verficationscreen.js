import React, {useEffect} from 'react';

import {View, StyleSheet, Text} from 'react-native';

import {getwh} from '../utils/layout';

import {useColorScheme} from 'react-native-appearance';

import Icon from 'react-native-vector-icons/Octicons';

function verificationscreen({navigation}) {
  const colorScheme = useColorScheme();
  useEffect(() => {
    var timeoutHandle = setTimeout(() => {
      navigation.push('Login');
    }, 2000);
  }, []);
  return (
    <View style={styles.mainview}>
      <Icon name="verified" size={45} style={styles.icon} />
      <Text style={colorScheme === 'dark' ? styles.darktitle : styles.title}>
        Please check the email sent to your account
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  mainview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darktitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    flexWrap: 'wrap',
    marginTop: getwh(5),
  },
  title: {
    color: '#000000',
    textAlign: 'center',
    flexWrap: 'wrap',
    marginTop: getwh(5),
  },
  icon: {
    color: '#008000',
  },
});
export default verificationscreen;
