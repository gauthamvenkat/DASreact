import * as React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

import walkthrough from './app/screens/walkthrough';

import login from './app/screens/login';

import register from './app/screens/register';

import mainscreen from './app/screens/mainscreen';

import addcoursescreen from './app/screens/addcoursescreen';

import {useColorScheme} from 'react-native-appearance';

const Stack = createStackNavigator();

function App() {
  const colorScheme = useColorScheme();
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Main" component={walkthrough} />
        <Stack.Screen name="Login" component={login} />
        <Stack.Screen name="Register" component={register} />
        <Stack.Screen name="Home" component={mainscreen} />
        <Stack.Screen name="AddCourse" component={addcoursescreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
