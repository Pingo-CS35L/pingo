import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import loginImage from '../assets/Pingo_transparent_icon.png'; 

const SignUpScreen = ({ navigation }) => {
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    // Actual authentication logic using the backend server
    fetch('http://localhost:3000/user/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: newEmail,
        password: newPassword,
      })
    })
    .then((response) => {
      console.log(response.body);
      if (response.status === 200) {
        setNewEmail('');
        setNewPassword('');

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

  const handleSignupHardcoded = () => {
    // Just pretend the user signed up
    navigation.navigate('Home');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigateToLogin = () => {
    // Navigate to the SignUpScreen
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image source={loginImage} style={styles.logo} />
      <Text style={styles.welcomeText}>Create an Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setNewEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={(text) => setNewName(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setNewUsername(text)}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          onChangeText={(text) => setNewPassword(text)}
        />
        <Button title={showPassword ? 'Hide' : 'Show'} onPress={togglePasswordVisibility} />
      </View>

      <Button title="Sign Up" onPress={handleSignupHardcoded} />
      <Text>Already have an account?</Text>
      <Button title="Login" onPress={navigateToLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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
  image: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    marginBottom: 20,
  },
});

export default SignUpScreen;
