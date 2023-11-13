import express from "express";
import { firebaseApp } from "../firebase.js";

const testRouter = express.Router();

testRouter.get("/", (req, res) => {
    res.send("Hello, Firebase!");
});

export { testRouter };
