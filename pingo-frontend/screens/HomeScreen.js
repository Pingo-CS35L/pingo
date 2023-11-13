import React from 'react';
import { View, ScrollView, Text, Button } from 'react-native';

function PingoSquare({ prompt }) {
  return (
    <View style={{ backgroundColor: 'black', margin: 20, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white' }}>{prompt}</Text>
    </View>
  );
}

function PingoCard() {
 return (
    <View style={{ backgroundColor: 'white'}}>
      <Text style={{ color: 'white' }}>Pingo Card</Text>
      <PingoSquare prompt="High Five Someone"></PingoSquare>
      <PingoSquare prompt="Low Five Someone"></PingoSquare>
      <PingoSquare prompt="Slap Someone"></PingoSquare>
      <PingoSquare prompt="High Five Someone"></PingoSquare>
      <PingoSquare prompt="Low Five Someone"></PingoSquare>
      <PingoSquare prompt="Slap Someone"></PingoSquare>
      <PingoSquare prompt="High Five Someone"></PingoSquare>
      <PingoSquare prompt="Low Five Someone"></PingoSquare>
      <PingoSquare prompt="Slap Someone"></PingoSquare>
    </View>
 );
}

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text>Today's Pingo:</Text>
      <Text>0 squares completed</Text>
      <PingoCard></PingoCard>
      <Button
        title="Logout"
        onPress={() => navigation.navigate('Login')}
      />
    </ScrollView>
  );
};

export default HomeScreen;