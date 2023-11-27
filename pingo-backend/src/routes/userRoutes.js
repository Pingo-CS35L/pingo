import express from "express";
import { firebaseApp } from "../firebase.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";

const userRouter = express.Router();
const auth = getAuth(firebaseApp);

// Middleware to get the current user's UID
const getCurrentUserUID = (req, res, next) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            req.currentUserUID = user.uid;
        }
        next();
    });
};

// Allows for user's UID to be available for each route by simply calling req.currentUserUID
userRouter.use(getCurrentUserUID);

userRouter.post("/login", async (req, res) => {
    const reqData = req.body;

    signInWithEmailAndPassword(auth, reqData.email, reqData.password)
        .then((userCredential) => {
            // Logged in
            const user = userCredential.user;
            return res
                .status(200)
                .json({ success: true, message: "Logged in successfully!", uid: user.uid });
        })
        .catch((error) => {
            return res
                .status(401)
                .json({ success: false, message: error.message });
        });
});

userRouter.post("/signup", async (req, res) => {
    const reqData = req.body;

    createUserWithEmailAndPassword(auth, reqData.email, reqData.password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log(user.uid);
            return res
                .status(200)
                .json({ success: true, message: "Signed up successfully!", uid: user.uid });
        })
        .catch((error) => {
            return res
                .status(401)
                .json({ success: false, message: error.message });
        });
});

userRouter.get("/getUserInfo", async (req, res) => {
    const uid = req.currentUserUID;
    // Implement firebase data schema to fetch user's information (use the uid above to search through the Realtime Database)
});

userRouter.get("/getUserImages", async (req, res) => {
    const uid = req.currentUserUID;
    // Implement firebase data schema to fetch user's pingo board images
});

userRouter.get("/getPingoStatus", async (req, res) => {
    const uid = req.currentUserUID;
    // Implement firebase data schema to get how many tiles user has finished in pingo board
});

export { userRouter };
