import express from 'express';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import { firebaseApp } from './index.js';

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

