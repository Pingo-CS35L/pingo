import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { pickPrompts } from '../prompts';
import { useUser } from './../UserContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#3498db', // Updated background color
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff', // Updated text color
  },
  subHeading: {
    fontSize: 16,
    marginBottom: 20,
    color: '#ffffff', // Updated text color
  },
  bingoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  bingoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  square: {
    backgroundColor: 'black',
    margin: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 8,
  },
  squareText: {
    color: 'white',
  },
  logoutButton: {
    backgroundColor: '#27ae60', // Updated button color
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#ffffff', // Updated text color
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

function PingoSquare({ prompt }) {
  return (
    <View style={styles.square}>
      <Text style={styles.squareText}>{prompt}</Text>
    </View>
  );
}

function PingoCard({ prompts }) {
  const rows = 3;
  const cols = 3;

  const chunkArray = (arr, size) => {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArray.push(arr.slice(i, i + size));
    }
    return chunkedArray;
  };

  const gridPrompts = chunkArray(prompts, cols);

  return (
    <View style={styles.bingoCard}>
      {gridPrompts.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.bingoRow}>
          {row.map((prompt, colIndex) => (
            <PingoSquare key={colIndex} prompt={prompt} />
          ))}
        </View>
      ))}
    </View>
  );
}

const HomeScreen = ({ navigation }) => {
  const [prompts, setPrompts] = useState(pickPrompts());
  const { uid, setUid } = useUser();

  const logout = () => {
    setUid(null);
    navigation.navigate('Login');
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Hi User {uid}</Text>
      <Text style={styles.heading}>Today's Pingo</Text>
      <Text style={styles.subHeading}>0 squares completed</Text>
      <PingoCard prompts={prompts} />
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;
