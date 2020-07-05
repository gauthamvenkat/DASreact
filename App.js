import React, {useEffect, useState} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

import {ActivityIndicator} from 'react-native';

import walkthrough from './app/screens/walkthrough';

import login from './app/screens/login';

import register from './app/screens/register';

import mainscreen from './app/screens/mainscreen';

import addcoursescreen from './app/screens/addcoursescreen';

import viewdetails from './app/screens/viewdetails';

import AsyncStorage from '@react-native-community/async-storage';

import postattendance from './app/screens/postattendance';

import postattendancev from './app/screens/postattendancev';

import {useColorScheme} from 'react-native-appearance';

const Stack = createStackNavigator();

function App() {
  const [appLogin, setAppLogin] = useState(false);
  const [activity, setActivity] = useState(false);
  const colorScheme = useColorScheme();
  useEffect(() => {
    const authToken = AsyncStorage.getItem('login');
    authToken.then(function(result) {
      if (result === 'true') {
        setAppLogin(true);
        setActivity(true);
        setActivity(false);
      }
    });
  }, []);
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {activity ? (
        <ActivityIndicator />
      ) : (
        <Stack.Navigator
          initialRouteName={appLogin ? 'Home' : 'Main'}
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Main" component={walkthrough} />
          <Stack.Screen name="Login" component={login} />
          <Stack.Screen name="Register" component={register} />
          <Stack.Screen name="Home" component={mainscreen} />
          <Stack.Screen name="AddCourse" component={addcoursescreen} />
          <Stack.Screen name="ViewDetails" component={viewdetails} />
          <Stack.Screen name="PostAttendance" component={postattendance} />
          <Stack.Screen name="PostAttendanceV" component={postattendancev} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
export default App;
