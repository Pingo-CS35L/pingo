import express from "express";
import multer from "multer";
import { firebaseApp, database, storage } from "../firebase.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { master_prompts } from "../promptsList.js";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const userRouter = express.Router();
const auth = getAuth(firebaseApp);

// Fixes file size issue 

const upload = multer({
    storage: multer.memoryStorage(), // Memory storage instead of disk
    limits: {
        // Adjust file size
        fileSize: 50 * 1024 * 1024, // Currently set to 50MB
        // Adjust file name size if necessary (unlikely)
        fieldNameSize: 100,
        fieldSize: 50 * 1024 * 1024, // Currently set to 50MB
    },
});


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
    console.log("Logging in");

    const { email, password } = req.body;

    if (email === undefined || password === undefined) {
        return res
            .status(401)
            .json({
                success: false,
                message: "Missing email and/or password in request body.",
            });
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Logged in
            const user = userCredential.user;
            return res
                .status(200)
                .json({
                    success: true,
                    message: "Logged in successfully!",
                    uid: user.uid,
                });
        })
        .catch((error) => {
            return res
                .status(401)
                .json({ success: false, message: error.message });
        });
});

userRouter.post("/signup", async (req, res) => {
    console.log("Signing up");

    const { email, username, password } = req.body;

    if (
        email === undefined ||
        username === undefined ||
        password === undefined
    ) {
        return res
            .status(401)
            .json({
                success: false,
                message:
                    "Missing email, username, and/or password in request body.",
            });
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        // Signed up
        const user = userCredential.user;

        const dateNow = new Date().toLocaleDateString("en-US", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
        });

        const generatedPrompts = generatePrompts();

        const newUserData = {
            username: username,
            email: email,
            completed_pingos: 0,
            completed_prompts: 0,
            friends: [],
            last_completed_pingo: dateNow,
            latest_completed_prompts: 0,
            latest_prompts: generatedPrompts,
            latest_prompts_pictures: Array(9).fill(""),
        };

        setDoc(doc(database, "users", user.uid), newUserData);

        return res
            .status(200)
            .json({
                success: true,
                message: "Signed up successfully!",
                uid: user.uid,
            });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: error.message });
    }
});

userRouter.post("/getUserImages", async (req, res) => {
    console.log("Getting user images");

    try {
        const { userId } = req.body;

        if (userId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "userId is required in request body.",
                });
        }
        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No User Found with that userId",
                });
        }

        const data = docSnap.data();

        const lastTimestamp = data["last_completed_pingo"];
        const dateNow = new Date().toLocaleDateString("en-US", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
        });
        const timeStamp = new Date(lastTimestamp).toLocaleDateString("en-US", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
        });
        
        let pics = [];

        if (timeStamp && dateNow !== timeStamp) {

            const generatedPrompts = generatePrompts();
            pics = Array(9).fill("");

            await updateDoc(docRef, {
                latest_prompts: generatedPrompts,
                last_completed_pingo: dateNow,
                latest_completed_prompts: 0,
                latest_prompts_pictures: pics,
            });
            
        } else {
            pics = data["latest_prompts_pictures"];
        }

        return res
            .status(200)
            .json({
                success: true,
                today_pictures: pics,
            });

    } catch (error) {
        console.log(error);
        return res
            .status(403)
            .json({ success: false, message: "Error retrieving user images." });
    }
});

userRouter.post("/getPingoStats", async (req, res) => {
    console.log("Getting pingo stats");

    try {
        const { userId } = req.body;

        if (userId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "userId is required in request body.",
                });
        }
        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No User Found with that userId",
                });
        }

        return res
            .status(200)
            .json({
                success: true,
                today_score: docSnap.data()["latest_completed_prompts"],
                total_completed_pingos: docSnap.data()["completed_pingos"],
                total_completed_prompts: docSnap.data()["completed_prompts"],
            });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Error retrieving user" });
    }
});

function generatePrompts() {
    let promptsCopy = [...master_prompts];
    let prompt_arr = [];

    while (prompt_arr.length < 9 && promptsCopy.length > 0) {
        const randomIndex = Math.floor(Math.random() * promptsCopy.length);
        const selectedPrompt = promptsCopy.splice(randomIndex, 1)[0];
        prompt_arr.push(selectedPrompt);
    }

    return prompt_arr;
}

userRouter.post("/getPrompts", async (req, res) => {
    console.log("Getting prompts");

    try {
        const { userId } = req.body;

        if (userId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "userId is required in request body.",
                });
        }

        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No User Found with that userId",
                });
        }
        const data = docSnap.data();

        const lastTimestamp = data["last_completed_pingo"];
        const dateNow = new Date().toLocaleDateString("en-US", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
        });
        const timeStamp = new Date(lastTimestamp).toLocaleDateString("en-US", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
        });

        if (timeStamp && dateNow !== timeStamp) {
            try {
                const generatedPrompts = generatePrompts();
                await updateDoc(docRef, {
                    latest_prompts: generatedPrompts,
                    last_completed_pingo: dateNow,
                    latest_completed_prompts: 0,
                    latest_prompts_pictures: Array(9).fill(""),
                });
                return res
                    .status(200)
                    .json({
                        success: true,
                        message: "Generated Prompts",
                        prompts: generatedPrompts,
                    });
            } catch {
                console.error("Error generating prompts:", error);
                return res
                    .status(500)
                    .json({ success: false, message: "Error generating prompts" });
            }
        } else {
            const storedPrompts = data["latest_prompts"];
            return res
                .status(200)
                .json({
                    success: true,
                    message: "Returned Latest Prompts",
                    prompts: storedPrompts,
                });
        }
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ success: false, message: "Error retrieving prompts" });
    }
});

// get all users from the database and send back as json
userRouter.get("/getAllUsers", async (req, res) => {
    console.log("Getting all users");

    try {
        const snapshot = await firestore.collection("users").get();
        const data = snapshot.docs.map((doc) => doc.data());
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, error: "Error retrieving users" });
    }
});

// get a single user by id
userRouter.post("/getUserById", async (req, res) => {
    console.log("Getting user by ID");

    try {
        const { userId } = req.body;

        if (userId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "userId is required in request body.",
                });
        }
        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No User Found with that userId",
                });
        }

        return res.status(200).json({ success: true, user: docSnap.data() });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Error retrieving user" });
    }
});

// delete user from db
userRouter.delete("/deleteUser", async (req, res) => {
    console.log("Deleting user");

    const { userId } = req.body;
    if (userId === undefined) {
        return res
            .status(401)
            .json({
                success: false,
                message: "userId is required in request body.",
            });
    }
    await deleteDoc(doc(database, "users", userId))
        .then(() => {
            res.status(200).json({ success: true, message: "user deleted" });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: err });
        });
});

userRouter.post("/addFriend", async (req, res) => {
    console.log("Adding friend");

    try {
        const { userId, friendId } = req.body;
        if (userId === undefined || friendId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "userId and friendId is required in request body.",
                });
        }
        const docRef1 = doc(database, "users", userId);
        const docRef2 = doc(database, "users", friendId);
        const docSnap1 = await getDoc(docRef1);
        const docSnap2 = await getDoc(docRef2);

        if (!docSnap1.exists() || !docSnap2.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No User and/or Friend Found with that ID",
                });
        }
        if (
            docSnap1.data()["friends"].includes(friendId) ||
            docSnap2.data()["friends"].includes(userId)
        ) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "At least one of you are already friends",
                });
        }

        await updateDoc(docRef1, {
            friends: [...docSnap1.data()["friends"], friendId],
        });

        await updateDoc(docRef2, {
            friends: [...docSnap2.data()["friends"], userId],
        });
        return res
            .status(200)
            .json({ success: true, message: "Successfully added friend" });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Failed to become friends" });
    }
});

userRouter.delete("/deleteFriend", async (req, res) => {
    console.log("Deleting friend");

    try {
        const { userId, friendId } = req.body;
        if (userId === undefined || friendId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "userId and friendId is required in request body.",
                });
        }
        const docRef1 = doc(database, "users", userId);
        const docRef2 = doc(database, "users", friendId);
        const docSnap1 = await getDoc(docRef1);
        const docSnap2 = await getDoc(docRef2);

        if (!docSnap1.exists() || !docSnap2.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No User and/or Friend Found with that ID",
                });
        }
        if (
            !docSnap1.data()["friends"].includes(friendId) ||
            !docSnap2.data()["friends"].includes(userId)
        ) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "At least one of you are not friends",
                });
        }
        await updateDoc(docRef1, {
            friends: docSnap1
                .data()
                ["friends"].filter((item) => item !== friendId),
        });
        await updateDoc(docRef2, {
            friends: docSnap2
                .data()
                ["friends"].filter((item) => item !== userId),
        });
        return res
            .status(200)
            .json({ success: true, message: "Successfully deleted friend" });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Failed to remove friend" });
    }
});

userRouter.post("/getAllFriends", async (req, res) => {
    console.log("Getting all friends");

    try {
        const { userId } = req.body;
        if (userId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "userId is required in request body.",
                });
        }
        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({ success: false, message: "No such user found." });
        }
        return res.status(200).json({ success: true, friendIds: docSnap.data()["friends"] });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Failed to get all friends" });
    }
});

userRouter.post("/getFriendsUsernames", async (req, res) => {
    console.log("Getting friends usernames");
    
    try {
        const { userId } = req.body;
        if (userId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "UserId is required in request body.",
                });
        }
        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({ success: false, message: "No such user found." });
        }
        const friendIds = docSnap.data()["friends"];
        let friendUsernames = [];
        for (let i = 0; i < friendIds.length; i++) {
            const id = friendIds[i];
            const friendDocRef = doc(database, "users", id);
            const friendDocSnap = await getDoc(friendDocRef);
            if (!friendDocSnap.exists()) {
                return res
                    .status(500)
                    .json({
                        success: false,
                        message: "Friend found that is not a valid user.",
                    });
            }

            friendUsernames.push(friendDocSnap.data()["username"]);
        }
        return res
            .status(200)
            .json({ success: true, friendUsernames: friendUsernames });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Failed to get friends' usernames",
            });
    }
});

userRouter.post("/getFriendData", async (req, res) => {
    console.log("Getting friend data");
    
    try {
        const { userId } = req.body;

        if (userId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "UserId is required in request body.",
                });
        }

        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({ success: false, message: "No such user found." });
        }

        const friendIds = docSnap.data()["friends"];
        let friendUsernames = [];
        let friendPrompts = [];
        let friendPics = [];

        for (let i = 0; i < friendIds.length; i++) {
            const friendId = friendIds[i];

            const friendDocRef = doc(database, "users", friendId);
            const friendDocSnap = await getDoc(friendDocRef);

            if (!friendDocSnap.exists()) {
                return res
                    .status(500)
                    .json({
                        success: false,
                        message: "Friend found that is not a valid user.",
                    });
            }

            friendUsernames.push(friendDocSnap.data()["username"]);

            const lastTimestamp = friendDocSnap.data()["last_completed_pingo"];
            const dateNow = new Date().toLocaleDateString("en-US", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
            });
            const timeStamp = new Date(lastTimestamp).toLocaleDateString("en-US", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
            });

            let prompts = [];
            let pics = [];

            if (timeStamp && dateNow !== timeStamp) {

                prompts = generatePrompts();
                pics = Array(9).fill("");

                await updateDoc(friendDocRef, {
                    latest_prompts: prompts,
                    last_completed_pingo: dateNow,
                    latest_completed_prompts: 0,
                    latest_prompts_pictures: pics,
                });

            } else {
                prompts = friendDocSnap.data()["latest_prompts"];
                pics = friendDocSnap.data()["latest_prompts_pictures"];
            }

            friendPrompts.push(prompts);
            friendPics.push(pics);
        }

        return res
            .status(200)
            .json({ success: true, friendIds: friendIds, friendUsernames: friendUsernames, friendPrompts: friendPrompts, friendPics, friendPics });

    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Failed to get friend data",
            });
    }
});

userRouter.post("/recommendFriends", async (req, res) => {
    console.log("Recommending friends");
    
    try {

        const { userId } = req.body;

        if (userId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "userId is required in request body.",
                });
        }

        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No user found with that ID",
                });
        }

        const recommendedFriendsIds = [];
        const recommendedFriendsUsernames = [];

        const currentUserFriendIds = docSnap.data()["friends"];
        for (let i = 0; i < currentUserFriendIds.length; i++) {
            let friendId = currentUserFriendIds[i];
            const friendDocRef = doc(database, "users", friendId);
            const friendDocSnap = await getDoc(friendDocRef);

            if (!friendDocSnap.exists()) {
                return res
                    .status(500)
                    .json({
                        success: false,
                        message: "Friend found that does not exist as a user.",
                    });
            }

            const friendsFriendIds = friendDocSnap.data()["friends"];
            for (let j = 0; j < friendsFriendIds.length; j++) {
                const friendFriendId = friendsFriendIds[j];

                if (friendFriendId !== userId && !currentUserFriendIds.includes(friendFriendId)) {

                    const friendFriendDocRef = doc(database, "users", friendFriendId);
                    const friendFriendDocSnap = await getDoc(friendFriendDocRef);


                    if (!friendFriendDocSnap.exists()) {
                        return res
                            .status(500)
                            .json({
                                success: false,
                                message: "Friend friend found that does not exist as a user.",
                            });
                    }

                    recommendedFriendsIds.push(friendFriendId);
                    recommendedFriendsUsernames.push(friendFriendDocSnap.data()["username"]);
                }
            }
        }

        if (recommendedFriendsIds.length < 2) {

            for(let i = 0; i < 5; i++) {
                const usersCollection = collection(database, 'users');
                const querySnapshot = await getDocs(usersCollection);
                
                const totalUsers = querySnapshot.size;

                const randomIndex = Math.floor(Math.random() * totalUsers);
                let randIds = [];

                querySnapshot.forEach((doc) => {
                    const randId = doc.id;
                    randIds.push(randId);
                });

                const randomUserId = randIds[randomIndex];

                if (randomUserId !== userId && !currentUserFriendIds.includes(randomUserId)) {
                    const foundFriendDocRef = doc(database, "users", randomUserId);
                    const foundFriendDocSnap = await getDoc(foundFriendDocRef);

                    if (!foundFriendDocSnap.exists()) {
                        return res
                            .status(500)
                            .json({
                                success: false,
                                message: "Random friend found that does not exist as a user.",
                            });
                    }
                    
                    if (!recommendedFriendsIds.includes(randomUserId)) {
                        recommendedFriendsIds.push(randomUserId);
                        recommendedFriendsUsernames.push(foundFriendDocSnap.data()["username"]);
                    }
                }
            }
        }

        return res
            .status(200)
            .json({
                success: true,
                recommendedFriendsIds: recommendedFriendsIds,
                recommendedFriendsUsernames: recommendedFriendsUsernames
            });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Failed to recommend friends. " + error });
    }
});

// Route to upload images to Firebase Storage                                            
userRouter.post('/uploadImage', upload.any(), async function(req, res) {
    console.log("Uploading image");
    
  try {
    const { userId, promptNum, image } = req.body;

    if (userId === undefined || promptNum === undefined || image === undefined) {
        return res
            .status(401)
            .json({
                success: false,
                message: "userId, promptNum, and base64String are required in request body.",
            });
    }

    const decodedImage = Buffer.from(image, "base64");
   
    const currentDate = new Date();

    const formattedDateTime = currentDate
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0];

    const fileName = formattedDateTime + ".jpeg";

    const storageRef = ref(storage, "images/" + fileName);

    const snapshot = await uploadBytes(storageRef, decodedImage);

    const downloadURL = await getDownloadURL(snapshot.ref);

    const docRef = doc(database, "users", userId);

    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return res
            .status(401)
            .json({
                success: false,
                message: "No User Found with that userId",
            });
    }

    const data = docSnap.data();

    const score = data["latest_completed_prompts"];
    const pics = data["latest_prompts_pictures"];
    const totalPingos = data["completed_pingos"];
    const totalPrompts = data["completed_prompts"];

    if (score == 9) {
        return res.status(500).json({ success: false, message: "Unable to add Pingo; already completed today's Pingo board." });
    }

    let newScore = score >= 9 ? 9 : score + 1;
    let newPics = [];
    let newTotalPingos = (newScore >= 9) ? totalPingos + 1 : totalPingos;
    let newTotalPrompts = totalPrompts + 1;

    for (let i = 0; i < pics.length; i++) {
        if (i === parseInt(promptNum)) {
            newPics.push(downloadURL);
        } else {
            newPics.push(pics[i]);
        }
    }

    await updateDoc(docRef, {
        latest_completed_prompts: newScore,
        latest_prompts_pictures: newPics,
        completed_pingos: newTotalPingos,
        completed_prompts: newTotalPrompts
    });

    return res.status(200).json({ success: true, message: "Successfully added image." });
  } 
  catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export { userRouter };
