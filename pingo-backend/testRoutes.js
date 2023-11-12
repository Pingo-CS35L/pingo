import express from "express";
import { firebaseApp } from './firebase.js';

const testRouter = express.Router();

testRouter.get('/', (req, res) => {
  res.send('Hello, Firebase!');
});

testRouter.get('/getPingoStatus', async (req, res) => {
  try {
	// Implement firebase data schema to get how many tiles user has finished in pingo board
  console.log("test status");
  } catch (error) {
    console.error('Error getting data from Firebase:', error);
  }
});

export {testRouter};