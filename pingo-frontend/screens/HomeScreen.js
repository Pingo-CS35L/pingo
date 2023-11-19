import React, { useState } from 'react';
import { View, ScrollView, Text, Button } from 'react-native';
import { pickPrompts } from '../prompts';

function PingoSquare({ prompt }) {
  return (
    <View style={{ backgroundColor: 'black', margin: 20, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white' }}>{prompt}</Text>
    </View>
  );
}

function PingoCard({ prompts }) {
  console.log(prompts)
  return (
    <View style={{ backgroundColor: 'white'}}>
      <Text style={{ color: 'white' }}>Pingo Card</Text>
      <PingoSquare prompt={prompts[0]}></PingoSquare>
      <PingoSquare prompt={prompts[1]}></PingoSquare>
      <PingoSquare prompt={prompts[2]}></PingoSquare>
      <PingoSquare prompt={prompts[3]}></PingoSquare>
      <PingoSquare prompt={prompts[4]}></PingoSquare>
      <PingoSquare prompt={prompts[5]}></PingoSquare>
      <PingoSquare prompt={prompts[6]}></PingoSquare>
      <PingoSquare prompt={prompts[7]}></PingoSquare>
      <PingoSquare prompt={prompts[8]}></PingoSquare>
    </View>
  );
}

const HomeScreen = ({ navigation }) => {
  const [prompts, setPrompts] = useState(pickPrompts());
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text>Today's Pingo:</Text>
      <Text>0 squares completed</Text>
      <PingoCard prompts={prompts}></PingoCard>
      <Button
        title="Logout"
        onPress={() => navigation.navigate('Login')}
      />
    </ScrollView>
  );
};

export default HomeScreen;