import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Pressable, Image } from 'react-native';
import { Icon } from 'react-native-elements'
import { pickPrompts } from '../prompts';
import appLogo from '../assets/pingo-icon.png';
import { useUser } from './../UserContext';
import { useFonts, JosefinSans_700Bold, InterTight_600SemiBold, InterTight_500Medium, InterTight_400Regular, InterTight_400Regular_Italic, InterTight_700Bold, NotoSansDisplay_400Regular } from '@expo-google-fonts/dev';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A9E8BF', // Updated background color
  },
  header: {
    height: 100,
    alignItems: 'flex-end'
  },
  logoContainer: {
    width: 40,
    height: 40,
    marginTop: 50,
    marginRight: 30,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 100
  },
  heading: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#1e2120',
    alignSelf: 'flex-start',
    marginLeft: 20,
    fontFamily: 'InterTight_700Bold',
    color: '#333330',
  },
  bingoCard: {
    padding: 15,
    marginTop: 40,
    marginBottom: 15,
    alignContent: 'flex-start'
  },
  bingoRow: {
    flexDirection: 'row'
  },
  square: {
    margin: 5,
    alignItems: 'center',
    flex: 1,
    minHeight: 150,
    alignSelf: 'flex-start'
  },
  picContainer: {
    backgroundColor: 'white',
    width: "100%",
    height: 105,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  picAddButton: {
    marginTop: 10
  },
  pic: {
    width: '100%',
    height: '100%',
    backgroundColor: 'orange',
    borderRadius: 5
  },
  picInfoText: {
    color: '#666666',
    fontSize: 11,
    fontFamily: 'InterTight_400Regular_Italic',
    textAlign: 'center',
    marginTop: 10
  },
  promptText: {
    color: '#1e2120',
    fontSize: 14,
    fontFamily: 'InterTight_500Medium',
    padding: 5,
    textAlign: 'center'
  },
  pingoStatusText: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'InterTight_700Bold',
    color: '#1d714a'
  }
});

function PingoSquare({ prompt, pic }) {
  if (pic !== null) {
    return (
      <View style={styles.square}>
        <View style={styles.picContainer}>
          <View style={styles.pic}></View>
        </View>
        <Text style={styles.promptText}>{prompt}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.square}>
        <View style={styles.picContainer}>
        <Pressable style={styles.picAddButton} onPress={() => alert("Akshat was here")}>
          <Icon
            name='camera-plus'
            type='material-community'
            color='#333330'
            size={35}
          />
        </Pressable>
          <Text style={styles.picInfoText}>Tap to Take Picture</Text>
        </View>
        <Text style={styles.promptText}>{prompt}</Text>
      </View>
    );
  }
  
}

function PingoCard({ prompts, pics }) {
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
            <PingoSquare key={colIndex} prompt={prompt} pic={pics[rowIndex * cols + colIndex]} />
          ))}
        </View>
      ))}
    </View>
  );
}

const HomeScreen = ({ navigation }) => {
  let [fontsLoaded, fontError] = useFonts({
    JosefinSans_700Bold, InterTight_600SemiBold, InterTight_500Medium, InterTight_400Regular, InterTight_400Regular_Italic, InterTight_700Bold, NotoSansDisplay_400Regular
  });

  const [prompts, setPrompts] = useState(pickPrompts());
  const [pics, setPics] = useState(Array(9).fill(null));
  const [numCompleted, setNumCompleted] = useState(0);
  const { uid, setUid } = useUser();

  if (!fontsLoaded && !fontError) {
    console.log("Error loading fonts");
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={appLogo} style={styles.logo} />
        </View>
        <Text style={styles.heading}>Today's Pingo</Text>
      </View>
      
      <PingoCard prompts={prompts} pics={pics} />

      <Text style={styles.pingoStatusText}>{numCompleted}/9 Prompts Completed</Text>
    </ScrollView>
  );
};

export default HomeScreen;
