import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, Button, Image, StyleSheet, Pressable } from 'react-native';
import { Icon } from 'react-native-elements';
import appLogo from '../assets/pingo-icon.png';
import { useUser } from './../UserContext';
import { useFonts, JosefinSans_700Bold, JosefinSans_500Medium, InterTight_600SemiBold, InterTight_500Medium, InterTight_700Bold } from '@expo-google-fonts/dev';

function FriendPingoSquare({ prompt, pic }) {
  
    if (pic !== null && pic !== undefined) {
      return (
        <View style={styles.square}>
          <View style={styles.picContainer}>
            <Image source={{ uri: pic }} style={styles.pic} />
          </View>
          <Text style={styles.promptText}>{prompt}</Text>
        </View>
      );
    } else {
      return (
          <View style={styles.square}>
              <View style={styles.picContainer}>
                  <Pressable
                      style={styles.picAddButton}
                  >
                      <Icon
                          name="camera-plus"
                          type="material-community"
                          color="#333330"
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

function FriendPingoCard({ prompts, pics }) {
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
              <FriendPingoSquare key={colIndex} prompt={prompt} pic={pics[rowIndex * cols + colIndex]} />
            ))}
          </View>
        ))}
      </View>
    );
}

const FriendsScreen = ({ navigation }) => {
  let [fontsLoaded, fontError] = useFonts({
    JosefinSans_700Bold, JosefinSans_500Medium, InterTight_600SemiBold, InterTight_500Medium, InterTight_700Bold
  });

  const { uid, setUid } = useUser();
  const [ friendIDs, setFriendIDs ] = useState(Array(2).fill("testFriendUID"));
  const [ friendUsernames, setFriendUsernames ] = useState(Array(2).fill("testFriendUsername"));
  const [ friendPrompts, setFriendPrompts ] = useState([Array(9).fill("testPrompt"), Array(9).fill("testPrompt")]);
  const [ friendPics, setFriendPics ] = useState([Array(9).fill("https://static.scientificamerican.com/sciam/cache/file/DB4E849F-5267-4A4C-A8A1F8AB1344C945_source.jpg?w=590&h=800&8397FFEE-1F26-49BC-98ECB53FE3F8A6D6"), Array(9).fill("https://static.scientificamerican.com/sciam/cache/file/DB4E849F-5267-4A4C-A8A1F8AB1344C945_source.jpg?w=590&h=800&8397FFEE-1F26-49BC-98ECB53FE3F8A6D6")]);

  if (!fontsLoaded && !fontError) {
    console.log("Error loading fonts");
    return null;
  }

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={appLogo} style={styles.logo} />
          </View>
          <Text style={styles.heading}>Friends</Text>
        </View>
        
        <View style={styles.friendPingosContainer}>
        {friendIDs.map((friendUID, index) => (
            <View key={friendUID} style={styles.friendPingoContainer}>
                <Text style={styles.subheading}>{friendUsernames[index]}</Text>
                <FriendPingoCard prompts={friendPrompts[index]} pics={friendPics[index]} />
            </View>
        ))}
        </View>

        <Text style={styles.subheading}>Add Friends</Text>
        <View style={styles.friendContainer}>
          <View style={styles.friendCard}>
            <Text style={styles.friendName}>pshank</Text>
          </View>
          <View style={styles.friendCard}>
            <Text style={styles.friendName}>rishauv</Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.navbar}>
        
        <View style={styles.navRow}>
          <Pressable style={styles.navButton} onPress={navigateToProfile}>
            <Icon name='account' type='material-community' color='#333330' size={40} />
          </Pressable>
          
          <Pressable style={styles.navButton} onPress={navigateToHome}>
            <Icon name='home' type='material-community' color='#333330' size={40} />
          </Pressable>
          
          <Pressable style={styles.navButton}>
            <Icon name='account-supervisor' type='material-community' color='#1d714a' size={40} />
          </Pressable>
        </View>
        
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#A9E8BF',
  },
  container: {
    backgroundColor: '#A9E8BF',
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#A9E8BF',
    width: '100%',
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
  subheading: {
    fontSize: 30,
    color: '#1e2120',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'InterTight_700Bold',
    color: '#333330',
  },
  
  bingoCard: {
    padding: 15,
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
  friendContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 120
  },
  friendCard: {
    backgroundColor: '#1e2120',
    width: '90%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 10,
    borderRadius: 50
  },
  friendName: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'InterTight_600SemiBold'
  },
  navbar: {
    backgroundColor: '#ffffff',
    height: 90,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 10
  },  
  navButton: {
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default FriendsScreen;