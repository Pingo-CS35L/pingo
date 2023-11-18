import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import signUpImage from '../assets/Pingo_transparent_icon.png'; 

const SignUpScreen = ({ navigation }) => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    // Add logic to handle user registration (e.g., API calls, validation)
    // For now, let's just go back to the Login screen
    navigation.goBack();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <Image source={signUpImage} style={styles.image} />

      <Text style={styles.title}>Pingo | Sign Up Page</Text>

      <TextInput
        style={styles.input}
        placeholder="New Username"
        onChangeText={(text) => setNewUsername(text)}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="New Password"
          secureTextEntry={!showPassword}
          onChangeText={(text) => setNewPassword(text)}
          onSubmitEditing={handleSignUp} 
        />
        <Button title={showPassword ? 'Hide' : 'Show'} onPress={togglePasswordVisibility} />
      </View>

      <Button
        title="Sign Up"
        onPress={handleSignUp}
      />
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
