import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import loginImage from '../assets/Pingo_transparent_icon.png';

const SignUpScreen = ({ navigation }) => {
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { uid, setUid } = useUser();

  const handleSignup = async () => {
    // Actual authentication logic using the backend server
    
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_SERVER}/user/signup`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: newEmail,
              password: newPassword,
          }),
      });

      const data = await response.json();

      if (data.success) {
          setNewEmail("");
          setNewUsername("");
          setNewPassword("");
          setUid(data.uid);
          navigation.navigate("Home");
      } else {
          alert("An account with that email already exists!");
      }
    } catch (error) {
      alert("Server error!");
      console.log(error);
    }
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
        value={newEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setNewUsername(text)}
        value={newUsername}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          onChangeText={(text) => setNewPassword(text)}
          value={newPassword}
        />
        <Button title={showPassword ? 'Hide' : 'Show'} onPress={togglePasswordVisibility} />
      </View>

      <Button title="Sign Up" onPress={handleSignup} />
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
