const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDW-VDyd9Iu8_fIHKoUc6g3EicHtCLBLqU",
  authDomain: "pingo-35l.firebaseapp.com",
  projectId: "pingo-35l",
  storageBucket: "pingo-35l.appspot.com",
  messagingSenderId: "844035613728",
  appId: "1:844035613728:web:8f4d8827e014f81c69c845"
};

// Initialize Firebase Admin SDK
admin.initializeApp(firebaseConfig);

// Port that the server API is listening to
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, Firebase!');
});

// Example route to communicate with Firebase
app.get('/validUser', async (req, res) => {
  try {
	// Implement firebase data schema to get bool of user validity from firebase auth
  } catch (error) {
    console.error('Error getting data from Firebase:', error);
  }
});

app.get('/getUserInfo', async (req, res) => {
  try {
	// Implement firebase data schema to get user email, user id, etc
  } catch (error) {
    console.error('Error getting data from Firebase:', error);
  }
});

app.get('/getUserImages', async (req, res) => {
  try {
	// Implement firebase data schema to fetch user's pingo board images
  } catch (error) {
    console.error('Error getting data from Firebase:', error);
  }
});

app.get('/getPingoStatus', async (req, res) => {
  try {
	// Implement firebase data schema to get how many tiles user has finished in pingo board
  } catch (error) {
    console.error('Error getting data from Firebase:', error);
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

