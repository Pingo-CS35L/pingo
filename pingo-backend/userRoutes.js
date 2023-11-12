import express from "express";
import { firebaseApp } from './firebase.js';

const userRouter = express.Router();

// Example route to communicate with Firebase
userRouter.get('/validUser', async (req, res) => {
  try {
	// Implement firebase data schema to get bool of user validity from firebase auth
  } catch (error) {
    console.error('Error getting data from Firebase:', error);
  }
});

userRouter.get('/getUserInfo', async (req, res) => {
  try {
	// Implement firebase data schema to get user email, user id, etc
  } catch (error) {
    console.error('Error getting data from Firebase:', error);
  }
});

userRouter.get('/getUserImages', async (req, res) => {
  try {
	// Implement firebase data schema to fetch user's pingo board images
  } catch (error) {
    console.error('Error getting data from Firebase:', error);
  }
});

export {userRouter};