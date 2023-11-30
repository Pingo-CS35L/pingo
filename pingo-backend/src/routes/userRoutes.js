import express from "express";
import { firebaseApp } from "../firebase.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { master_prompts } from "../promptsList.js";
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');


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

userRouter.put("/updateProfile", async (req,res)=>{
    const username = req.params.username;
    const bio = req.body.bio;
    const profileImageURL = req.body.profileImageURL;
    const backgroundColor = req.body.backgroundColor;
    const theme = req.body.theme;
    const fontSize = req.body.fontSize;
    const colorScheme = req.body.colorScheme;
    const userID = req.currentUserUID;
    const docPath = `users/${userID}`;
    var updates = {};
    if (typeof bio !== 'undefined') {
        updates['bio']= bio;
    }
    if (typeof profileImageURL !== 'undefined') {
        updates['profileImageURL']= profileImageURL;
    }
    if (typeof backgroundColor !== 'undefined') {
        updates['backgroundColor']= backgroundColor;
    }
    if (typeof theme !== 'undefined') {
        updates['theme']= theme;
    }
    if (typeof fontSize !== 'undefined') {
        updates['fontSize']= fontSize;
    }
    if (typeof colorScheme !== 'undefined') {
        updates['colorScheme']= colorScheme;
    }
    try {
        await firestore.collection('users').doc(userID)
        .set(updates, {merge: true}).then((response)=> {
            console.log(`Updated User Profile with ID of ${userID}`);
        })
        return res.status(200).json({message:`Successfully updated your profile!`, data:{}});
        }
    catch {
        return res.status(500).json({success:false, message:"Failed to update the user's profile!"})
    }
});

userRouter.post("/getPrompts", async (req, res) => {
    const uid = req.currentUserUID;
    try {
        let prompt_arr = [];
        while (prompt_arr.length < 9) {
            let num = Math.floor(Math.random() * 5);
            let promptsArr = master_prompts[num];
            prompt_arr.push(promptsArr[Math.floor(Math.random() * promptsArr.length)]);
        }
    // first check database for uid, check their latest prompts
    // if empty, use this function to generate prompts
    // if timestamp is not today, use function to generate new prompts
    // if timestamp is today, return current prompts
    const snapshot = await db.ref("users").child(uid).once("value");
    const value = snapshot.val();
    const lastTimestamp = value["lastPrompt"];
    const dateNow = moment().format("YYYY-MM-DD");
    const timeStamp = moment(lastTimestamp).format("YYYY-MM-DD")
    
    if (!timeStamp || !dateNow === timeStamp){
        const response = await axios.get('/api/generatePrompts');
        const generatedPrompts = response.data;
        await db.ref("users").child(uid).update({"latestPrompts":generatedPrompts,"lastPrompt":moment().
        format("YYYY-MM-DD")});
        return res.status(200).json({message:'Generated Prompts', data:generatedPrompts});
    } else{
        const response = await axios.get('/api/getLatestPrompts');
        const storedPrompts = response.data;
        return res.status(200).json({message:'Returned Latest Prompts', data:storedPrompts});
    };
    }
    catch (err) {
        console.error(err);
        return res.status(401).send('Error in retrieving prompts');
    }
});
// get all users from the database and send back as json
userRouter.get('/getAllUsers', async (req,res) => {
        try {
            const snapshot = await firestore.collection('users').get();
            const data = snapshot.docs.map(doc => doc.data());
            return res.status(200).json(data);
            } catch (error) {
                console.log(error);
                return res.status(403).json({ success: false, error: "Error retrieving users" });
            }
});
// get a single user by id
userRouter.get('/getUserById', async (req, res) => {
        try {
            const snap1 = await firestore.collection('users').where('id','==',req.params.id).limit(1).get();
            const snap2 = await firestore.collection('users').where('id','==',req.params.id).get();
            const data = snapshot.docs.map(doc => doc.data());
            return res.status(200).json(data);
            } 
        catch (error) {
            console.log(error);
            return res.status(403).json({ success: false, error: "Error retrieving user" });
        }
});
// update user info in db
userRouter.put('/updateUserInfo', async (req, res) => {
        const body = req.body;
        const id = req.params.id;
        const updates = {};
        Object.keys(body).forEach(key => {
            updates[`${key}`] = body[key];
        });
        firestore.collection('users')
        .doc(id)
        .update(updates)
        .then(() => {
        res.status(200).json({ success: true, message: 'User updated'});
        })
        .catch(err => {
        res.status(500).json({ success: false, err });
        });
 });
// delete user from db
userRouter.delete('/deleteUser', async (req, res) => {
        const id = req.params.id;
        firestore.collection('users')
        .doc(id)
        .delete()
        .then(() => {
            res.status(200).json({ success: true, message: 'user deleted'});
        })
        .catch(err => {
            res.status(500).json({ success: false, err });
        });
    });

export { userRouter };
