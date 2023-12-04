import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Pressable, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import appLogo from '../assets/pingo-icon.png';
import { useUser } from './../UserContext';
import Lightbox from 'react-native-lightbox';
import { useFonts, JosefinSans_700Bold, InterTight_600SemiBold, InterTight_500Medium, InterTight_400Regular, InterTight_400Regular_Italic, InterTight_700Bold, NotoSansDisplay_400Regular } from '@expo-google-fonts/dev';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#A9E8BF',
  },
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
    fontFamily: 'InterTight_600SemiBold',
    color: '#1d714a',
    marginBottom: 120
  },
  pingoStatusBoldText: {
    fontFamily: 'InterTight_700Bold'
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
  }, 
  picContainer: {
    backgroundColor: 'white',
    width: "100%",
    height: 105,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  enlargedImage: {
    width: 300, // Adjust the width and height as needed
    height: 300,
    borderRadius: 5,
  },
  pic: {
    width: '100%', // Set it to 100% to fill the parent container
    height: '80%', // Set it to 100% to fill the parent container
    borderRadius: 5,
    overflow: 'hidden', // Hide any content that overflows the box
  },
});

function PingoSquare({ prompt, pic, navigation, isStockPhoto, onStockPhotoPress }) {
  const navigateToCamera = () => {
    navigation.navigate("CameraScreen");
  };

  if (isStockPhoto) {
    return (
      <View style={styles.square}>
        <Lightbox
          renderContent={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={require('../assets/download.jpeg')} style={styles.enlargedImage} />
              <Text style={styles.promptText}>{prompt}</Text>
            </View>
          )}
          underlayColor="white" 
        >
          <View style={styles.picContainer}>
            <Image source={require('../assets/download.jpeg')} style={styles.pic} />
            <Text style={styles.promptText}>{prompt}</Text>
          </View>
        </Lightbox>
      </View>
    );
  } else if (pic !== null && pic !== undefined && pic !== "") {
    return (
      <View style={styles.square}>
        <Lightbox
          renderContent={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={{ uri: pic }} style={styles.enlargedImage} />
              <Text style={styles.promptText}>{prompt}</Text>
            </View>
          )}
          underlayColor="white" // Adjust the color of the underlay when the image is pressed
        >
          <View style={styles.picContainer}>
            <Image source={{ uri: pic }} style={styles.pic} />
            <Text style={styles.promptText}>{prompt}</Text>
          </View>
        </Lightbox>
      </View>
    );
  } else {
    return (
      <View style={styles.square}>
        <View style={styles.picContainer}>
          <Pressable
            style={styles.picAddButton}
            onPress={navigateToCamera}
          >
            <Icon
              name="camera-plus"
              type="material-community"
              color="#333330"
              size={42}
            />
          </Pressable>
          <Text style={styles.picInfoText}>Tap to Take Picture</Text>
        </View>
        <Text style={styles.promptText}>{prompt}</Text>
      </View>
    );
  }
}


function PingoCard({ prompts, pics, navigation }) {
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
          {row.map((prompt, colIndex) => {
            const isMiddleSquare = rowIndex === 1 && colIndex === 1;
            const picForSquare = isMiddleSquare ? null : pics[rowIndex * cols + colIndex];

            return (
              <PingoSquare
                key={colIndex}
                prompt={prompt}
                navigation={navigation}
                pic={picForSquare}
                isStockPhoto={false} // Set isStockPhoto to false for the middle square
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const HomeScreen = ({ navigation }) => {
  const { uid, setUid } = useUser();
  let [fontsLoaded, fontError] = useFonts({
    JosefinSans_700Bold, InterTight_600SemiBold, InterTight_500Medium, InterTight_400Regular, InterTight_400Regular_Italic, InterTight_700Bold, NotoSansDisplay_400Regular
  });

  const [prompts, setPrompts] = useState(Array(9).fill(""));
  const [pics, setPics] = useState(Array(9).fill(null));
  const [numCompleted, setNumCompleted] = useState(0);

  useEffect(() => {
    const fetchNumCompleted = async () => {
      try {
  
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_SERVER}/user/getPingoStats`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: uid
          }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          setNumCompleted(data.today_score);
        }
      } catch (error) {
        console.log('Error:', error);
      }
    };

    const fetchPrompts = async () => {
      try {
  
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_SERVER}/user/getPrompts`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: uid
          }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          setPrompts(data.prompts);
        }
      } catch (error) {
        console.log('Error:', error);
      }
    };

    const fetchPics = async () => {
      try {
  
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_SERVER}/user/getUserImages`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: uid
          }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          setPics(data.today_pictures);
        }
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchNumCompleted();
    fetchPrompts();
    fetchPics();
  }, [uid]);

  if (!fontsLoaded && !fontError) {
    console.log("Error loading fonts");
    return null;
  }

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const navigateToFriends = () => {
    navigation.navigate('Friends');
  };

  return (
    <View style={styles.screen}>

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={appLogo} style={styles.logo} />
          </View>
          <Text style={styles.heading}>Today's Pingo</Text>
        </View>
        
        <PingoCard prompts={prompts} pics={pics} navigation={navigation} />

        <Text style={styles.pingoStatusText}>
          <Text style={styles.pingoStatusBoldText}>{numCompleted}/9</Text> Squares Completed
        </Text>
      </ScrollView>

      <View style={styles.navbar}>
        
        <View style={styles.navRow}>
          <Pressable style={styles.navButton} onPress={navigateToProfile}>
            <Icon name='account' type='material-community' color='#333330' size={40} />
          </Pressable>
          
          <Pressable style={styles.navButton}>
            <Icon name='home' type='material-community' color='#1d714a' size={40} />
          </Pressable>
          
          <Pressable style={styles.navButton} onPress={navigateToFriends}>
            <Icon name='account-supervisor' type='material-community' color='#333330' size={40} />
          </Pressable>
        </View>
        
      </View>

    </View>
    
  );
};

export default HomeScreen;
