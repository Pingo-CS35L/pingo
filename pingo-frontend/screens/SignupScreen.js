// SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const SignUpScreen = ({ navigation }) => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSignUp = () => {
    // Add logic to handle user registration (e.g., API calls, validation)
    // For now, let's just go back to the Login screen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pingo | Sign Up Page</Text>

      <TextInput
        style={styles.input}
        placeholder="New Username"
        onChangeText={(text) => setNewUsername(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry={true}
        onChangeText={(text) => setNewPassword(text)}
      />

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
});

export default SignUpScreen;
