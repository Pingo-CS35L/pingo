import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import loginImage from '../assets/Pingo_transparent_icon.png';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Actual authentication logic using the backend server
    fetch('http://localhost:3000/user/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password,
      })
    })
    .then((response) => {
      console.log(response.body);
      if (response.status === 200) {
        setEmail('');
        setPassword('');

        navigation.navigate('Home');
      } else {
        alert('Invalid username or password. Please try again.');
      }
    })
    .catch((error) => {
      console.log(error);
      alert('Server error!');
    });
  };

  const handleLoginHardcoded = () => {
    // Hardcoded authentication logic
    if (email === 'ExampleUser' && password === 'ExamplePassword') {
      // Clear username and password on successful login
      setEmail('');
      setPassword('');

      navigation.navigate('Home');
    } else {
      alert('Invalid username or password. Please try again.');
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
      <Text style={styles.welcomeText}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          onChangeText={(text) => setPassword(text)}
        />
        <Button title={showPassword ? 'Hide' : 'Show'} onPress={togglePasswordVisibility} />
      </View>

      <Button title="Login" onPress={handleLoginHardcoded} />

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
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logo: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%', // Adjust the width as needed
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
  },
});

export default LoginScreen;
