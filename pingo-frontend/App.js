import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen.js';
import LoginScreen from './screens/LoginScreen.js';
import SignUpScreen from './screens/SignupScreen.js';
import ProfileScreen from './screens/ProfileScreen.js'
import { UserProvider } from './UserContext.js';
import CameraScreen from './screens/CameraScreen.js';
import FriendsScreen from './screens/FriendsScreen.js';

const Stack = createNativeStackNavigator();

const Pingo = () => {
  return (
      <UserProvider>
          <NavigationContainer>
              <Stack.Navigator
                  initialRouteName="Login"
                  screenOptions={{ headerShown: false, gestureEnabled: false }}
              >
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="SignUp" component={SignUpScreen} />
                  <Stack.Screen name="CameraScreen" component={CameraScreen} />
                  <Stack.Screen name="Profile" component={ProfileScreen} />
                  <Stack.Screen name="Friends" component={FriendsScreen} />
              </Stack.Navigator>
          </NavigationContainer>
      </UserProvider>
  );
};

export default Pingo;