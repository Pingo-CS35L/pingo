import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Basic authentication logic (replace this with your actual authentication logic)
    if (username === 'ExampleUser' && password === 'ExamplePassword') {
      // Authentication successful, navigate to the Home screen
      navigation.navigate('Home');
    } else {
      // Authentication failed, you might want to display an error message
      alert('Invalid username or password. Please try again.');
    }
  };

  const navigateToSignUp = () => {
    // Navigate to the SignUpScreen
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pingo | Login Page</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />

      <Button
        title="Login"
        onPress={handleLogin}
      />

      <Button
        title="Sign Up"
        onPress={navigateToSignUp}
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

export default LoginScreen;
