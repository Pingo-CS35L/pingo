import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, Button, Image, StyleSheet, Pressable } from 'react-native';
import appLogo from '../assets/pingo-icon.png';
import { useUser } from './../UserContext';
import { useFonts, JosefinSans_700Bold, JosefinSans_500Medium, InterTight_600SemiBold, InterTight_500Medium, InterTight_700Bold } from '@expo-google-fonts/dev';

const ProfileScreen = ({ navigation }) => {
  let [fontsLoaded, fontError] = useFonts({
    JosefinSans_700Bold, JosefinSans_500Medium, InterTight_600SemiBold, InterTight_500Medium, InterTight_700Bold
  });

  const [email, setEmail] = useState('testdummy@gmail.com');
  const [username, setUsername] = useState('testdummy');
  const [totalPingos, setTotalPingos] = useState(0);
  const [totalSquares, setTotalSquares] = useState(0);
  const [squaresToday, setSquaresToday] = useState(0);
  const { uid, setUid } = useUser();

  if (!fontsLoaded && !fontError) {
    console.log("Error loading fonts");
    return null;
  }

  const logout = () => {
    setUid(null);
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={appLogo} style={styles.logo} />
        </View>
        <Text style={styles.heading}>Your Profile</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.fieldInfo}>EMAIL</Text>
        <Text style={styles.field}>{email}</Text>

        <Text style={styles.fieldInfo}>USERNAME</Text>
        <Text style={styles.field}>{username}</Text>
      </View>
      
      <Text style={styles.subheading}>Pingo Statistics</Text>
      <Text style={styles.statistic}><Text style={styles.boldStatistic}>{totalPingos}</Text> TOTAL PERFECT PINGOS</Text>
      <Text style={styles.statistic}><Text style={styles.boldStatistic}>{totalSquares}</Text> TOTAL SQUARES COMPLETED</Text>
      <Text style={styles.statistic}><Text style={styles.boldStatistic}>{squaresToday}/9</Text> SQUARES COMPLETED TODAY</Text>

      <Text style={styles.subheading}>Friends</Text>
      <View style={styles.friendContainer}>
        <View style={styles.friendCard}>
          <Text style={styles.friendName}>pshank</Text>
        </View>
        <View style={styles.friendCard}>
          <Text style={styles.friendName}>rishauv</Text>
        </View>
      </View>

      <Pressable style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#A9E8BF', // Updated background color
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
  infoContainer: {
    width: '85%',
    alignSelf: 'center',
    marginTop: 40
  },
  fieldInfo: {
    color: '#666666',
    fontFamily: 'JosefinSans_500Medium',
    marginBottom: 5,
    fontSize: 16
  },
  field: {
    height: 60,
    width: '100%',
    borderColor: '#666666',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#dddddd',
    color: '#333333',
    fontSize: 20,
    fontFamily: 'InterTight_500Medium',
    overflow: 'hidden',
    marginBottom: 20,
    lineHeight: 57,
    paddingHorizontal: 15
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
  statistic: {
    fontSize: 18,
    color: '#1e2120',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
    fontFamily: 'JosefinSans_500Medium',
    color: '#666666',
  },
  boldStatistic: {
    fontFamily: 'JosefinSans_700Bold'
  },
  friendContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20
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
  logoutButton: {
    backgroundColor: '#1D714A',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '35%',
    borderRadius: 80,
    marginBottom: 80,
  },
  logoutButtonText: {
    fontFamily: 'InterTight_700Bold',
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  }
});

export default ProfileScreen;