import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Pressable } from 'react-native';
import appLogo from '../assets/pingo-icon.png';
import { useUser } from './../UserContext';
import { useFonts, JosefinSans_700Bold, InterTight_600SemiBold, InterTight_500Medium, InterTight_700Bold } from '@expo-google-fonts/dev';

const LoginScreen = ({ navigation }) => {
  let [fontsLoaded, fontError] = useFonts({
    JosefinSans_700Bold, InterTight_600SemiBold, InterTight_500Medium, InterTight_700Bold
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { uid, setUid } = useUser();

  if (!fontsLoaded && !fontError) {
    console.log("Error loading fonts");
    return null;
  }

  const handleLogin = async () => {
    // Actual authentication logic using the backend server
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_SERVER}/user/login`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: email,
              password: password,
          }),
      });

      const data = await response.json();

      if (data.success) {
          setEmail("");
          setPassword("");
          setUid(data.uid);
          navigation.navigate("Home");
      } else {
          alert("Invalid username or password. Please try again.");
      }
    } catch (error) {
      alert("Server error!");
      console.log(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigateToSignUp = () => {
    // Navigate to the SignUpScreen
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={appLogo} style={styles.logo} />
        </View>
        <Text style={styles.pingoText}>Pingo</Text>
      </View>
      
      <View style={styles.formContainer}>

        <Text style={styles.welcomeText}>Welcome Back</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          <Button title={showPassword ? 'Hide' : 'Show'} onPress={togglePasswordVisibility} />
        </View>

        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>

        <Text style={styles.signUpInfo}>Don't have an account?</Text>
        
        <Pressable style={styles.signUpButton} onPress={navigateToSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </Pressable>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#A9E8BF',
    width: '100%',
    height: 300,
    alignItems: 'flex-end'
  },
  logoContainer: {
    width: 40,
    height: 40,
    marginTop: 50,
    marginRight: 30,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 100
  },
  pingoText: {
    fontFamily: 'JosefinSans_700Bold',
    fontSize: 80,
    marginTop: 80,
    color: '#1d714a',
    alignSelf: 'center'
  },
  formContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 50,
    width: '100%',
    height: '100%'
  },
  welcomeText: {
    fontFamily: 'InterTight_600SemiBold',
    fontSize: 28,
    marginBottom: 20,
    color: '#333330', // Updated text color
  },
  input: {
    height: 60,
    width: '95%',
    borderColor: '#ffffff',
    borderRadius: 5,
    backgroundColor: '#dddddd',
    color: '#333333',
    paddingHorizontal: 15,
    fontSize: 20,
    fontFamily: 'InterTight_500Medium',
    overflow: 'hidden'
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    marginTop: 20,
    marginBottom: 40,
    borderRadius: 5,
    backgroundColor: '#dddddd',
  },
  passwordInput: {
    flex: 1,
    height: 60,
    paddingLeft: 15,
    color: '#333333',
    fontSize: 20,
    fontFamily: 'InterTight_500Medium',
    overflow: 'hidden'
  },
  showHideButton: {
    padding: 10,
    backgroundColor: '#27ae60', // Updated button color
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
  },
  loginButton: {
    backgroundColor: '#1D714A',
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '35%',
    borderRadius: 80,
    marginBottom: 80,
  },
  loginButtonText: {
    fontFamily: 'InterTight_700Bold',
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  signUpInfo: {
    color: '#333333',
    fontSize: 18,
    fontFamily: 'InterTight_600SemiBold'
  },
  signUpButton: {
    backgroundColor: '#ffffff'
  },
  signUpButtonText: {
    color: '#1D714A',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'InterTight_600SemiBold',
    textDecorationLine: 'underline'
  },
});

export default LoginScreen;

