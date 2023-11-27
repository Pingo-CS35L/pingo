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
  
    const userDocRef = firestore.collection('users').doc(uid);

    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const userInfo = {
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    total_images_uploaded: userData.total_images_uploaded,
                    perfect_games: userData.perfect_games
                };
                return res.status(200).json({ success: true, userInfo });
            } else {
                return res.status(404).json({ success: false, message: "User not found" });
            }
        })
        .catch((error) => {
            return res.status(500).json({ success: false, message: "Error fetching data" });
        });


});

userRouter.get("/getUserImages", async (req, res) => {
    const uid = req.currentUserUID;
    // TODO: Implement firebase data schema to fetch user's pingo board images. 
    // NOTE: Database will hold url to images, so calling get() on the database will return a url which will need to be processed farther. 
});

userRouter.get("/getPingoStatus", async (req, res) => {
    const uid = req.currentUserUID;

    const userDocRef = firestore.collection('users').doc(uid);
    
    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const currentScore = snapshot.val();
                return res.status(200).json({ success: true, current_score: currentScore });
            } else {
                return res.status(404).json({ success: false, message: "User not found" });
            }
        })
        .catch((error) => {
            return res.status(500).json({ success: false, message: "Error fetching data" });
        });
    
});

export { userRouter };
