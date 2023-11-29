import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen.js';
import LoginScreen from './screens/LoginScreen.js';
import SignUpScreen from './screens/SignupScreen.js';
import { UserProvider } from './UserContext.js';

const Stack = createNativeStackNavigator();

const Pingo = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="Home" component={HomeScreen}/>
          <Stack.Screen name="SignUp" component={SignUpScreen}/>

        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default Pingo;