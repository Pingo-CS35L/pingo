import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import loginImage from '../assets/Pingo_transparent_icon.png';
import { useUser } from './../UserContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { uid, setUid } = useUser();

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
      <Image source={loginImage} style={styles.logo} />
      <Text style={styles.welcomeText}>Welcome Back!</Text>

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

      <Button title="Login" onPress={handleLogin} />

      <Text>Don't have an account?</Text>
      <Button title="Sign Up" onPress={navigateToSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db', // Updated background color
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff', // Updated text color
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
    borderRadius: 15,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#ffffff', // Updated border color
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 15,
    borderRadius: 8,
    backgroundColor: '#ffffff', // Updated input background color
    color: '#333333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    borderColor: '#ffffff',
    borderWidth: 1,
    marginBottom: 120,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingLeft: 15,
    color: '#333333',
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
    backgroundColor: '#27ae60',
    padding: 15,
    width: '80%',
    borderRadius: 8,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  signUpText: {
    fontSize: 16,
    color: '#ffffff', // Updated text color
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27ae60', // Updated border color
    padding: 10,
    width: '80%',
  },
  signUpButtonText: {
    color: '#27ae60', // Updated text color
    textAlign: 'center',
  },
});

export default LoginScreen;

