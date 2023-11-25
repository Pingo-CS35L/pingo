import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import loginImage from '../assets/Pingo_transparent_icon.png';
import { backendServer } from "../../serverConfig";

const SignUpScreen = ({ navigation }) => {
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    // Actual authentication logic using the backend server
    fetch(`${backendServer}/signup`, {
        method: "POST",
        body: JSON.stringify({
            email: newEmail,
            password: newPassword,
        }),
    })
        .then((response) => {
            console.log(response.body);
            if (response.status === 200) {
                setNewEmail("");
                setNewPassword("");

                navigation.navigate("Home");
            } else {
                alert("Invalid username or password. Please try again.");
            }
        })
        .catch((error) => {
            console.log(error);
            alert("Server error!");
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
    backgroundColor: '#3498db', // Updated background color
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff', // Updated text color
  },
  logo: {
    width: 120, // Adjusted width
    height: 120, // Adjusted height
    marginBottom: 30,
    borderRadius: 15, // Added border radius
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#ffffff', // Updated border color
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 15,
    borderRadius: 8,
    backgroundColor: '#f2f2f2', // Updated background color
    color: '#333333', // Updated text color
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    borderColor: '#ffffff', // Updated border color
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#f2f2f2', // Updated background color
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingLeft: 15,
    color: '#333333',
  },
});

export default SignUpScreen;
